/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../base';
import { Round } from '../round';
import { Answer } from '../answer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('questions')
export class Question extends AppBaseEntity {
  @ApiProperty()
  @Column('text')
  title: string;

  @ApiProperty({ required: false })
  @Column('text', { default: '' })
  correctAnswer: string;

  @ApiProperty()
  @Column('int', { default: 0 })
  order: number;

  @ApiProperty({ required: false })
  @Column('text', { array: true, default: {} })
  medias: string[];

  @OneToMany(
    type => Answer,
    answer => answer.question
  )
  answers: Answer[];

  @ManyToOne(
    type => Round,
    round => round.questions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  round: Round;
}
