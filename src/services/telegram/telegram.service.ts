/* eslint-disable @typescript-eslint/camelcase */
import { User } from 'src/db/entities/user';
import { Injectable } from '@nestjs/common';
import { TelegrafStart, ContextMessageUpdate, TelegrafOn } from 'nestjs-telegraf';
import { GamesService } from '../game';
import { AuthService } from '../auth';

import { Extra, Markup } from 'telegraf';
import { TelegramScene } from 'src/db/entities/telegram-action/telegram-scene.enum';
import { TelegramActionRepository } from 'src/db/repositories';
import { TelegramAction } from 'src/db/entities/telegram-action';
import { Message, ExtraEditMessage } from 'telegraf/typings/telegram-types';
import { Game } from 'src/db/entities';

import * as fs from 'fs';

export interface Context extends ContextMessageUpdate {
  user: User;
  action: TelegramAction;
}

export interface SendMessage {
  ctx: Context;
  message?: string;
  messageNumber?: number;
  markupNumber?: number;
  markup?: Extra & ExtraEditMessage;
  removeKeyboard?: boolean;
  deletePrevious?: boolean;
  media?: string;
}

const generateKeyboard = (msgs: string[]) =>
  Extra.markdown().markup(m => m.keyboard(msgs.map(msg => m.callbackButton(msg))).resize());

const MESSAGES = [
  `Привет. Что бы начать игру тебе необходимо ввести токен, полученный от менеджера`,
  `Ошибка. Напишите нам`,
  'К сожалению, токен неверный. Попробуйте скопировать и вставить еще раз',
  `Вы успешно зарегестрировались на игру. Что-бы начать, нажмите "Начать Игру"`,
  `Правильный Ответ`,
  `Неправильный Ответ. Попробуйте еще раз`,
  `Пока что вы не можете использовать подсказку`,
  `Подсказок больше нет`,
  `Вы можете воспользоваться подсказкой. Нажмите или напишите "Подсказка"`
];

const MARKUPS = [generateKeyboard(['Начать Игру'])];

@Injectable()
export class TelegramService {
  public messagesForDelete = [];
  public timeouts = {};

  constructor(
    private authService: AuthService,
    private gamesService: GamesService,
    private telegramActionRepository: TelegramActionRepository
  ) {}

  @TelegrafStart()
  async startHandler(ctx: Context) {
    await this.parseContext(ctx);
    await this.clearChat(ctx);
    await this.updateAction({ ctx, scene: TelegramScene.REGISTRATION, round: 0 });

    const messageNumber = ctx.user ? 0 : 1;

    this.sendMessage({ ctx, messageNumber, removeKeyboard: true });
  }

  @TelegrafOn('text')
  async textHandler(ctx: Context) {
    await this.parseContext(ctx);

    switch (ctx.action.scene) {
      case TelegramScene.REGISTRATION:
        this.tokenHandler(ctx);
        break;
      case TelegramScene.GAME:
        this.startGameHandler(ctx);
        break;
      case TelegramScene.ROUND:
        this.roundHandler(ctx);
        break;
    }
  }

  public async roundHandler(ctx: Context) {
    const msg = ctx.message.text.toLowerCase();

    msg === 'подсказка' ? this.showHint(ctx) : this.checkAnswer(ctx);
  }

  public async tokenHandler(ctx: Context) {
    const token = ctx.message.text;
    await this.registerToGame(ctx, token);
  }

  public async registerToGame(ctx: Context, token) {
    const { user } = ctx;
    const verified = await this.gamesService.verifyToken(token);

    if (verified) {
      const { game } = await this.gamesService.useToken({ token, user });
      this.updateAction({ ctx, scene: TelegramScene.GAME, game: game });

      await this.sendMessage({ ctx, messageNumber: 3, markupNumber: 0 });
    } else {
      this.sendMessage({ ctx, messageNumber: 2 });
    }
  }

  public async startGameHandler(ctx: Context) {
    if (ctx.message.text === 'Начать Игру') {
      await this.clearChat(ctx);
      await this.startGame(ctx, ctx.action.game);
    } else {
      ctx.deleteMessage();
    }
  }

  public async startGame(ctx: Context, game: Game) {
    if (game.hi) {
      await this.sendMessage({ ctx, message: game.hi.title });
      await this.sendMessage({ ctx, message: game.hi.description });
    }

    await this.startRound(ctx);
  }

  public async showHint(ctx: Context) {
    const { showHint, game, round, hint } = ctx.action;
    const hints = game.rounds[round].hints;
    if (hints && hint < hints.length && hints.length !== 0) {
      const hintMessage = game.rounds[round].hints[hint];

      await this.sendMessage({ ctx, message: showHint && hintMessage, messageNumber: 6, removeKeyboard: true });
      if (showHint) {
        this.updateAction({ ctx, hint: ctx.action.hint + 1 });
        await this.toogleHint(ctx);

        if (ctx.action.game.rounds[round].hints[ctx.action.hint]) {
          this.startHintTimer(ctx);
        }
      }
    } else {
      this.sendMessage({ ctx, messageNumber: 7, removeKeyboard: true });
    }
  }

  public startHintTimer(ctx: Context) {
    this.timeouts[ctx.from.id] = setTimeout(async () => {
      await this.toogleHint(ctx);
      this.sendMessage({ ctx, messageNumber: 8, markup: generateKeyboard(['Подсказка']) });
    }, 10000);
  }

  public async startRound(ctx: Context) {
    const { game, round } = ctx.action;

    if (this.timeouts[ctx.from.id]) {
      clearTimeout(this.timeouts[ctx.from.id]);
    }

    if (round < game.rounds.length && game.rounds.length !== 0) {
      const currentRound = game.rounds[round];

      const { title, media } = currentRound.questions[0];

      await this.sendMessage({ ctx, message: title, media: media });

      await this.updateAction({ ctx, scene: TelegramScene.ROUND, hint: 0, showHint: false });

      this.startHintTimer(ctx);
    } else if (game.bye) {
      await this.sendMessage({ ctx, message: game.bye.title });
      await this.sendMessage({ ctx, message: game.bye.description });
    }
  }

  public async nextRound(ctx: Context) {
    await this.updateAction({ ctx, round: ctx.action.round + 1 });
    await this.clearChat(ctx);
    await this.startRound(ctx);
  }

  public async checkAnswer(ctx: Context) {
    const answer = ctx.message.text;

    const { round, game } = ctx.action;

    const correctAnswer = game.rounds[round].questions[0].correctAnswer;

    const isCorrect = correctAnswer.toLowerCase() === answer.toLowerCase();

    await this.sendMessage({ ctx, messageNumber: isCorrect ? 4 : 5 });

    if (isCorrect) {
      await this.nextRound(ctx);
    }
  }

  public async createTelegramAction(user: User): Promise<TelegramAction> {
    const telegramAction = new TelegramAction();
    telegramAction.user = user;

    await telegramAction.save();

    return telegramAction;
  }

  public async clearChat(ctx: Context, force = false) {
    const telegramAction = await this.telegramActionRepository.findOne({ user: ctx.user });

    const messagesForDelete = telegramAction.messages.filter(msg => force || msg.remove);

    for (let i = 0; i < messagesForDelete.length; i++) {
      try {
        await ctx.deleteMessage(messagesForDelete[i].id);
      } catch {}
    }

    const restMessages = telegramAction.messages.filter(def => !messagesForDelete.some(del => del.id === def.id));

    await this.telegramActionRepository.update({ user: ctx.user }, { messages: restMessages });
  }

  public async saveMessageId(ctx: Context, msg: Message, remove = true) {
    const telegramAction = await this.telegramActionRepository.findOne({ user: ctx.user });
    const messages = [...telegramAction.messages, { id: msg.message_id, remove }];
    await this.telegramActionRepository.update({ user: ctx.user }, { messages });
  }

  public async sendMessage(props: SendMessage) {
    const { ctx, message, messageNumber, markupNumber, markup, removeKeyboard, media } = props;

    const replyMessage = message || MESSAGES[messageNumber];
    const replyMarkup = removeKeyboard ? Markup.removeKeyboard().extra() : markup || MARKUPS[markupNumber];

    if (media) {
      const isPhoto = media.match(/\.(jpg|jpeg|png)$/);
      const isVideo = media.match(/\.(mp4)$/);

      const sendMedia = {
        source: fs.createReadStream(`media/${media}`)
      };

      const previewMsg = await ctx.reply('Идет загрузка медиа...');
      const mediaMsg = await ((isPhoto && ctx.replyWithPhoto(sendMedia)) || (isVideo && ctx.replyWithVideo(sendMedia)));
      ctx.deleteMessage(previewMsg.message_id);
      removeKeyboard ? ctx.deleteMessage(mediaMsg.message_id) : await this.saveMessageId(ctx, mediaMsg);
    }

    if (replyMessage) {
      const msg = await ctx.reply(replyMessage, replyMarkup);
      await this.saveMessageId(ctx, msg);
    } else if (removeKeyboard) {
      const msg = await ctx.reply('Deleting...', replyMarkup);
      ctx.deleteMessage(msg.message_id);
    }
  }

  public async updateAction(params) {
    const { ctx, ...fields } = params;

    const telegramAction = await this.telegramActionRepository.findOne({ user: ctx.user });

    for (const key in fields) {
      if (fields.hasOwnProperty(key) && (fields[key] || fields[key] === 0 || fields[key] === false)) {
        telegramAction[key] = fields[key];
      }
    }
    await telegramAction.save();
    await this.initAction(ctx);
  }

  public async parseContext(ctx: Context) {
    await this.initUser(ctx);
    await this.initAction(ctx);
    if (ctx.message) {
      await this.saveMessageId(ctx, ctx.message);
    }
  }

  public async initUser(ctx: Context) {
    const { id: telegramId, first_name, last_name, username } = ctx.from;

    const name = username || `${first_name} ${last_name}`;

    let user = await this.authService.getUser({ telegramId });

    if (!user) {
      user = await this.authService.createPlayer({ telegramId, name });
      await this.createTelegramAction(user);
    }

    ctx.user = user;
  }

  public async initAction(ctx: Context) {
    const user = ctx.user;
    ctx.action = await this.telegramActionRepository.findOne(
      { user },
      { relations: ['user', 'game', 'game.rounds', 'game.rounds.questions'] }
    );
  }

  public async toogleHint(ctx: Context) {
    await this.updateAction({ ctx, showHint: !ctx.action.showHint });
  }
}
