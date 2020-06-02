/* eslint-disable @typescript-eslint/no-unused-vars */
import { Question } from './../question/question.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../base';
import { Game } from '../game';
import { ApiProperty } from '@nestjs/swagger';

@Entity('rounds')
export class Round extends AppBaseEntity {
  @ApiProperty()
  @Column('text')
  name: string;

  @ApiProperty()
  @Column('int')
  order: number;

  @ApiProperty({ required: false })
  @Column('text', { array: true, nullable: true, default: '{}' })
  hints: string[];

  @OneToMany(
    type => Question,
    question => question.round
  )
  questions: Question[];

  @ManyToOne(
    type => Game,
    game => game.rounds,
    { cascade: true }
  )
  game: Game;
}
