import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/db/entities/question';

@Injectable()
export class QuestionsService extends TypeOrmCrudService<Question> {
  constructor(@InjectRepository(Question) repository: Repository<Question>) {
    super(repository);
  }
}
