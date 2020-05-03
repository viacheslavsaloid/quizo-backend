import { Repository, EntityRepository } from 'typeorm';
import { TelegramAction } from 'src/db/entities/telegram-action';

@EntityRepository(TelegramAction)
export class TelegramActionRepository extends Repository<TelegramAction> {}
