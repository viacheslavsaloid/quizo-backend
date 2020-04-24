/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, BaseEntity, Column, ManyToOne } from 'typeorm';
import { User } from '../user';
import { Game } from '../game/game.entity';

@Entity('games-users')
export class GameUser extends BaseEntity {
  @Column({ type: 'boolean', default: false })
  access: boolean;

  @ManyToOne(
    type => User,
    user => user.accessGames,
    { primary: true, onDelete: 'CASCADE' }
  )
  user: User;

  @ManyToOne(
    type => Game,
    game => game.players,
    { primary: true, onDelete: 'CASCADE' }
  )
  game: Game;
}
