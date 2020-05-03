/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, OneToOne, Column, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Game } from '../game';
import { TelegramScene } from './telegram-scene.enum';

@Entity('telegram-actions')
export class TelegramAction extends AppBaseEntity {
  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @ManyToOne(
    type => Game,
    game => game.telegramActions
  )
  game: Game;

  @Column({ type: 'int', default: 0 })
  round: number;

  @Column({ type: 'int', default: 0 })
  hint: number;

  @Column({ type: 'boolean', default: false })
  showHint: boolean;

  @Column({ type: 'varchar', default: TelegramScene.REGISTRATION })
  scene: TelegramScene;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  messages: [
    {
      id: number;
      remove: boolean;
    }
  ];
}
