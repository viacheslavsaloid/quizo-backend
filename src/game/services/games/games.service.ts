import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/db';

@Injectable()
export class GamesService extends TypeOrmCrudService<Game> {
  constructor(@InjectRepository(Game) usersRepository: Repository<Game>) {
    super(usersRepository);
  }
}
