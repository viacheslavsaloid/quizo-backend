import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import { Extra } from 'telegraf';
import { Repository } from 'typeorm';
import { User } from 'src/db/entities';
import { AppContext } from './context.model';

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
  repository?: Repository<User>;
}
