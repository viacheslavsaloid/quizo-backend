/* eslint-disable @typescript-eslint/camelcase */
import { Markup } from 'nestjs-telegraf';
import { TELEGRAM_MESSAGES, TELEGRAM_MARKUPS } from 'src/assets/telegram';
import { TelegramMedia } from 'src/db/entities';
import { SendMessage } from 'src/app/models';

import * as fs from 'fs';

async function saveMessageId(msg, props: SendMessage) {
  const { ctx, removeMessage: remove = true } = props;
  const { messages = [] } = ctx.session;

  const getMessage = { id: ctx.message.message_id, remove };
  const replyMessage = { id: msg.message_id, remove };

  const isGetDublicate = messages.find(x => x.id === getMessage.id);
  const isReplyDublicate = messages.find(x => x.id === replyMessage.id);

  ctx.session.messages = [...messages];

  isGetDublicate || ctx.session.messages.push(getMessage);
  isReplyDublicate || ctx.session.messages.push(replyMessage);
}

async function sendMedia(props) {
  const { ctx, media } = props;

  const isPhoto = media.file_path.match(/\.(jpg|jpeg|png)$/);
  const isVideo = media.file_path.match(/\.(mp4)$/);

  const mediaReply = media.file_id || {
    source: fs.createReadStream(`media/${media.file_path}`)
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

export function sendMessageHandler(props) {
  const { ctx, next, repository } = props;

  ctx.sendMessage = async (props: SendMessage) => {
    const { message, messageNumber, media } = props;

    const isText = message || messageNumber;
    const isMedia = media;

    const mediaExist = await repository.findOne({ file_path: media });
    props.media = mediaExist || {
      file_path: media
    };

    const reply = { media: null, text: null };

    reply.media = isMedia && (await sendMedia(props));
    reply.text = isText && (await sendText(props));

    if (reply.media && !mediaExist) {
      const telegramMedia = new TelegramMedia();
      telegramMedia.file_path = media;
      telegramMedia.file_id = (reply.media.video && reply.media.video.file_id) || (reply.media.photo && reply.media.photo[0].file_id);
      await telegramMedia.save();
    }

    return reply;
  };

  next();
}
