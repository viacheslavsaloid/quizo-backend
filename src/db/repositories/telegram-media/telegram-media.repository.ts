import { Repository, EntityRepository } from 'typeorm';
import { TelegramMedia } from 'src/db/entities';

@EntityRepository(TelegramMedia)
export class TelegramMediaRepository extends Repository<TelegramMedia> {}
