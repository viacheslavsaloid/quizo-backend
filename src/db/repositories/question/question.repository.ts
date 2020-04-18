import { Repository, EntityRepository } from 'typeorm';
import { Question } from 'src/db/entities';

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {}
