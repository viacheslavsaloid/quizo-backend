import { SendMessage } from 'src/shared/models';
import { Markup } from 'nestjs-telegraf';
import { TELEGRAM_MESSAGES, TELEGRAM_MARKUPS } from 'src/data/telegram';

import * as fs from 'fs';

async function saveMessageId(msg, props: SendMessage) {
  const { ctx, removeMessage: remove = true } = props;
  const { messages = [] } = ctx.session;

  const replyMessage = { id: msg.message_id, remove };
  const getMessage = { id: ctx.message.message_id, remove };

  ctx.session.messages = [...messages, replyMessage, getMessage];
}

async function sendMedia(props: SendMessage) {
  const { ctx, media } = props;

  const isPhoto = media.match(/\.(jpg|jpeg|png)$/);
  const isVideo = media.match(/\.(mp4)$/);

  const mediaReply = {
    source: fs.createReadStream(`media/${media}`)
  };

  const preview = await ctx.reply('Идет загрузка медиа...');
  const reply = await ((isPhoto && ctx.replyWithPhoto(mediaReply)) || (isVideo && ctx.replyWithVideo(mediaReply)));
  ctx.deleteMessage(preview.message_id);

  saveMessageId(reply, props);
  return reply;
}

async function sendText(props: SendMessage) {
  const { ctx, message, messageNumber, markupNumber, markup, removeKeyboard } = props;

  const replyMessage = message || TELEGRAM_MESSAGES[messageNumber];
  const replyMarkup = removeKeyboard ? Markup.removeKeyboard().extra() : markup || TELEGRAM_MARKUPS[markupNumber];

  const reply = await ctx.reply(replyMessage, replyMarkup);
  saveMessageId(reply, props);
  return reply;
}

export async function sendMessage(props: SendMessage) {
  const { message, messageNumber, media } = props;

  const isText = message || messageNumber;
  const isMedia = media;

  isMedia && (await sendMedia(props));
  isText && (await sendText(props));
}
