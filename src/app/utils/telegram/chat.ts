import { Repository } from 'typeorm';
import { User } from 'src/db/entities';
import { AppContext } from 'src/app/models/telegram/context.model';

import { Markup } from 'nestjs-telegraf';
import { TELEGRAM_MESSAGES, TELEGRAM_MARKUPS } from 'src/assets/telegram';
import { TelegramMedia } from 'src/db/entities';
import { SendMessage } from 'src/app/models';

interface Props {
  ctx: AppContext;
  repository?: Repository<User>;
  force?: boolean;
  deleteCurrent?: boolean;
  savePrevious?: number;
}

async function saveMessageId(msg, props: SendMessage) {
  const { ctx, removeMessage: remove = true } = props;
  const { messages = [] } = ctx.state.user.telegram;

  const getMessage = { id: ctx.message.message_id, remove };
  const replyMessage = { id: msg.message_id, remove };

  const isGetDuplicate = messages.find(x => x.id === getMessage.id);
  const isReplyDuplicate = messages.find(x => x.id === replyMessage.id);

  ctx.state.user.telegram.messages = [...messages];

  isGetDuplicate || ctx.state.user.telegram.messages.push(getMessage);
  isReplyDuplicate || ctx.state.user.telegram.messages.push(replyMessage);
}

async function sendMedia(props) {
  const { ctx, media } = props;

  const isPhoto = media.file_path.match(/\.(jpg|jpeg|png)$/);
  const isVideo = media.file_path.match(/\.(mp4)$/);
  const isAudio = media.file_path.match(/\.(mp3)$/);

  const mediaReply = media.file_id || {
    source: `media/${media.file_path}`
  };

  const preview = await ctx.reply('Идет загрузка медиа...');
  const reply = await ((isPhoto && ctx.replyWithPhoto(mediaReply)) ||
    (isVideo && ctx.replyWithVideo(mediaReply)) ||
    (isAudio && ctx.replyWithAudio(mediaReply)));

  ctx.deleteMessage(preview.message_id);

  await saveMessageId(reply, props);

  const { team = [] } = ctx.state.player || {};
  team.forEach((teamPlayer) => {
    if (isPhoto) {
      ctx.telegram.sendPhoto(teamPlayer.user.telegramId, mediaReply);
    } else if (isVideo) {
      ctx.telegram.sendVideo(teamPlayer.user.telegramId, mediaReply);
    } else if (isAudio) {
      ctx.telegram.sendAudio(teamPlayer.user.telegramId, mediaReply);
    }
  });

  return reply;
}

async function sendText(props: SendMessage) {
  const { ctx, message, messageNumber, markupNumber, markup, removeKeyboard } = props;

  const replyMessage = message || TELEGRAM_MESSAGES[messageNumber];
  const replyMarkup = removeKeyboard ? Markup.removeKeyboard().extra() : markup || TELEGRAM_MARKUPS[markupNumber];

  const reply = await ctx.reply(replyMessage, { ...replyMarkup, parse_mode: 'HTML' });
  await saveMessageId(reply, props);

  const { team = [] } = ctx.state.player || {};
  team.forEach((teamPlayer) => {
    ctx.telegram.sendMessage(teamPlayer.user.telegramId, replyMessage, { ...replyMarkup, parse_mode: 'HTML' });
  });

  return reply;
}

async function saveMediaOnTelegram(props) {
  const { media, replyMedia } = props;

  const telegramMedia = new TelegramMedia();
  telegramMedia.file_path = media;

  telegramMedia.file_id =
    (replyMedia.video && replyMedia.video.file_id) ||
    (replyMedia.photo && replyMedia.photo[0].file_id) ||
    (replyMedia.audio && replyMedia.audio.file_id);

  await telegramMedia.save();
}

export async function clearChat(props: Props) {
  const { ctx, force, deleteCurrent = true, savePrevious = 0 } = props;

  const { messages = [] } = ctx.state.user.telegram;

  const messagesForDelete = messages
    .slice(0, messages.length - savePrevious) // * Deleate all except Save Previous from end
    .filter(x => x.remove || force);

  if (deleteCurrent) {
    await ctx.deleteMessage();
  }

  for (let i = 0; i < messagesForDelete.length; i++) {
    try {
      await ctx.deleteMessage(messagesForDelete[i].id);
    } catch (err) {}
  }

  ctx.state.user.telegram.messages = messages.filter(def => !messagesForDelete.some(del => del.id === def.id));
}

export function getSendMessageFunc(props) {
  const { ctx, repository } = props;

  return async (props: SendMessage) => {
    const { message, messageNumber, medias = [] } = props;

    for (const media of medias) {
      const mediaExist = await repository.findOne({ file_path: media });

      const modifyMedia = mediaExist || {
        file_path: media
      };

      const replyMedia = await sendMedia({ ctx, media: modifyMedia });

      if (replyMedia && !mediaExist) await saveMediaOnTelegram({ replyMedia, media });
    }

    const isText = message || messageNumber || messageNumber === 0;
    isText && (await sendText(props));
  };
}
