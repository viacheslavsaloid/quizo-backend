import { Repository, EntityRepository } from 'typeorm';
import { Game } from 'src/db/entities/game';

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {}
