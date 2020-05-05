/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Game } from '../game';
import { GameScene } from './game-scene';

@Entity('players')
export class Player extends AppBaseEntity {
  @Column({ type: 'boolean', default: true })
  access: boolean;

  @Column({ type: 'int', default: 0 })
  round: number;

  @Column({ type: 'int', default: 0 })
  hint: number;

  @Column({ type: 'boolean', default: false })
  showHint: boolean;

  @Column({ type: 'varchar', default: GameScene.REGISTRATION })
  scene: GameScene;

  @ManyToOne(
    type => User,
    user => user.accessGames,
    { cascade: true }
  )
  user: User;

  @ManyToOne(
    type => Game,
    game => game.players,
    { cascade: true }
  )
  game: Game;
}
