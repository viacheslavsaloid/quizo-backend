import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from 'src/db/entities/player';

@Injectable()
export class PlayersService extends TypeOrmCrudService<Player> {
  constructor(@InjectRepository(Player) repository: Repository<Player>) {
    super(repository);
  }
}
