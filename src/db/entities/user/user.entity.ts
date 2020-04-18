/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { AppBaseEntity } from '../base';
import { UserRole } from './user-role.enum';
import { comparePasswords } from 'src/shared';
import { Game } from '../game';
import { Answer } from '../answer';

@Entity('users')
export class User extends AppBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  role: UserRole;

  @OneToMany(
    type => Answer,
    answer => answer.user,
    { onDelete: 'CASCADE' }
  )
  answers: Answer[];

  @ManyToMany(
    type => Game,
    game => game.user,
    { onDelete: 'CASCADE' }
  )
  accessGames: Game[];

  @OneToMany(
    type => Game,
    game => game.user,
    { onDelete: 'CASCADE' }
  )
  games: Game[];

  validatePassword = async (password: string): Promise<boolean> => comparePasswords(password, this.salt, this.password);
}
