import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from 'src/db/entities/answer';

@Injectable()
export class AnswersService extends TypeOrmCrudService<Answer> {
  constructor(@InjectRepository(Answer) repository: Repository<Answer>) {
    super(repository);
  }
}
