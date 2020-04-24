import { Repository, EntityRepository } from 'typeorm';
import { Round } from 'src/db/entities/round';

@EntityRepository(Round)
export class RoundRepository extends Repository<Round> {}
