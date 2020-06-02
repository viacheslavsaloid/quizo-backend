import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/db/entities/question';

@Injectable()
export class QuestionsService extends TypeOrmCrudService<Question> {
  constructor(@InjectRepository(Question) private questionRepository: Repository<Question>) {
    super(questionRepository);
  }

  public async sort(rounds) {
    await Promise.all(rounds.map((round, index) => this.questionRepository.update({ id: round.id }, { order: index + 1 })));
    return this.questionRepository.find({ relations: ['round'] });
  }

  public async getCount(options): Promise<number> {
    const [_, count] = await this.questionRepository.findAndCount(options);
    return count;
  }
}
