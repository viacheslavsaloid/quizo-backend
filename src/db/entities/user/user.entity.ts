/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../base';
import { UserRole } from './user-role.enum';
import { Game } from '../game';
import { Answer } from '../answer';
import { GameUser } from '../game-user';

@Entity('users')
export class User extends AppBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ type: 'simple-array' })
  roles: [UserRole];

  @OneToMany(
    type => Answer,
    answer => answer.user,
    { onDelete: 'CASCADE' }
  )
  answers: Answer[];

  @OneToMany(
    type => GameUser,
    gameUser => gameUser.user
  )
  accessGames: GameUser[];

  @OneToMany(
    type => Game,
    game => game.owner,
    { onDelete: 'CASCADE' }
  )
  ownGames: Game[];
}
