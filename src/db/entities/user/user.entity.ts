/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { AppBaseEntity } from '../base';
import { UserRole } from './user-role.enum';
import { Game } from '../game';
import { Answer } from '../answer';
import { Player } from '../player';

@Entity('users')
export class User extends AppBaseEntity {
  @Column({ unique: true, nullable: true })
  telegramId: string;

  @Column({ unique: true, nullable: true })
  name: string;

  @Column({ nullable: true })
  salt: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'simple-array' })
  roles: [UserRole];

  @OneToMany(
    type => Answer,
    answer => answer.user
  )
  answers: Answer[];

  @OneToMany(
    type => Player,
    player => player.user
  )
  accessGames: Player[];

  @OneToMany(
    type => Game,
    game => game.owner
  )
  ownGames: Game[];
}
