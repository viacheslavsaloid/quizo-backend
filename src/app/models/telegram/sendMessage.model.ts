import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import { Extra } from 'telegraf';
import { AppContext } from './context.model';
import { TelegramMediaRepository } from 'src/db/repositories';

export interface SendMessage {
  ctx?: AppContext;
  message?: string;
  messageNumber?: number;
  markupNumber?: number;
  markup?: Extra & ExtraEditMessage;
  removeKeyboard?: boolean;
  removeMessage?: boolean;
  deletePrevious?: boolean;
  media?: string;
  medias?: string[];
  repository?: TelegramMediaRepository;
}
