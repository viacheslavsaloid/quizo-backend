import { Question } from './../question/question.entity';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Game } from '../game';

@Entity('rounds')
export class Round extends AppBaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @OneToMany(
    type => Question,
    question => question.round,
    { onDelete: 'CASCADE' }
  )
  questions: Round[];

  @ManyToOne(
    type => Game,
    game => game.rounds,
    { onDelete: 'CASCADE' }
  )
  game: Game;
}
