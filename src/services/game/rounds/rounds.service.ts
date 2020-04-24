import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Round } from 'src/db/entities/round';
import { GamesService } from '../games/games.service';

@Injectable()
export class RoundsService extends TypeOrmCrudService<Round> {
  private logger = new Logger('Rounds Service');

  constructor(@InjectRepository(Round) private repository: Repository<Round>, private gamesService: GamesService) {
    super(repository);
  }

  public async setActiveRound(id) {
    const { game } = await this.repository.findOne(id, { relations: ['game'] });
    return this.gamesService.setActiveRound({ id, game });
  }

  public async sort(rounds) {
    await Promise.all(rounds.map((round, index) => this.repository.update({ id: round.id }, { order: index + 1 })));
    return this.repository.find();
  }
}
