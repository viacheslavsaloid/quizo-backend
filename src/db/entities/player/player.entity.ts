/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Game } from '../game';

@Entity('players')
export class Player extends AppBaseEntity {
  @Column('boolean', { default: true })
  access: boolean;

  @ManyToOne(
    type => User,
    user => user.accessGames,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  user: User;

  @ManyToOne(
    type => Game,
    game => game.players,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  game: Game;
}
