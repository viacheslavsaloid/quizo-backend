import { Repository, EntityRepository } from 'typeorm';
import { Question } from 'src/db/entities/question';

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {}
