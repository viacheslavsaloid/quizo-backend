import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Round } from 'src/db/entities/round';
import { GamesService } from '../games/games.service';
import { SocketService } from '../../socket/socket.service';

@Injectable()
export class RoundsService extends TypeOrmCrudService<Round> {
  constructor(
    @InjectRepository(Round) private roundRepository: Repository<Round>,
    private gamesService: GamesService,
    private socketService: SocketService
  ) {
    super(roundRepository);
  }

  public get() {
    return this.roundRepository.find();
  }

  public async toogleActiveRound(roundId) {
    const round = await this.roundRepository.findOne(roundId, { relations: ['game'] });
    const gameId = round.game.id;
    const { activeRound } = await this.gamesService.toogleActiveRound({ roundId, gameId });
    this.socketService.emit('round_toogled', activeRound);

    return { activeRound };
  }

  public async sort(rounds) {
    await Promise.all(rounds.map((round, order) => this.roundRepository.update({ id: round.id }, { order })));
    return this.roundRepository.find({ relations: ['game'] });
  }

  public async getCount(options): Promise<number> {
    const [_, count] = await this.roundRepository.findAndCount(options);
    return count;
  }
}
