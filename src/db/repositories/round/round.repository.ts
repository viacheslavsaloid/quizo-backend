import { Repository, EntityRepository } from 'typeorm';
import { Round } from 'src/db/entities';

@EntityRepository(Round)
export class RoundRepository extends Repository<Round> {}
