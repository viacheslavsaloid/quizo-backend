import { Repository, EntityRepository } from 'typeorm';
import { Player } from 'src/db/entities/player';

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {}
