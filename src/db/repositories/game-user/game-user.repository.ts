import { Repository, EntityRepository } from 'typeorm';
import { GameUser } from 'src/db/entities/game-user';

@EntityRepository(GameUser)
export class GameUserRepository extends Repository<GameUser> {}
