/* eslint-disable @typescript-eslint/no-unused-vars */
import { Question } from './../question/question.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../base';
import { Game } from '../game';
import { ApiProperty } from '@nestjs/swagger';

@Entity('rounds')
export class Round extends AppBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty()
  @Column({ type: 'integer' })
  order: number;

  @ApiProperty({ required: false })
  @Column({ type: 'simple-array', nullable: true })
  hints: string[];

  @OneToMany(
    type => Question,
    question => question.round
  )
  questions: Question[];

  @ManyToOne(
    type => Game,
    game => game.rounds
  )
  game: Game;
}
