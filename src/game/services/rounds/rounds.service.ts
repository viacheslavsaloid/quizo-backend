import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Round } from 'src/db';

@Injectable()
export class RoundsService extends TypeOrmCrudService<Round> {
  constructor(@InjectRepository(Round) repository: Repository<Round>) {
    super(repository);
  }
}
