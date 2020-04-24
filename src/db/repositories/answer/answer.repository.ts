import { Repository, EntityRepository } from 'typeorm';
import { Answer } from 'src/db/entities/answer';

@EntityRepository(Answer)
export class AnswerRepository extends Repository<Answer> {}
