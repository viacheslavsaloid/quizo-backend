import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Round } from 'src/db/entities/round';
import { GamesService } from '../games/games.service';

@Injectable()
export class RoundsService extends TypeOrmCrudService<Round> {
  constructor(@InjectRepository(Round) private roundRepository: Repository<Round>, private gamesService: GamesService) {
    super(roundRepository);
  }

  public async toogleActiveRound(roundId) {
    const round = await this.roundRepository.findOne(roundId, { relations: ['game'] });
    const gameId = round.game.id;
    return this.gamesService.toogleActiveRound({ roundId, gameId });
  }

  public async sort(rounds) {
    await Promise.all(rounds.map((round, index) => this.roundRepository.update({ id: round.id }, { order: index + 1 })));
    return this.roundRepository.find();
  }
}
