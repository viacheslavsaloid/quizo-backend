import { Repository, EntityRepository } from 'typeorm';
import { Answer } from 'src/db/entities';

@EntityRepository(Answer)
export class AnswerRepository extends Repository<Answer> {}
