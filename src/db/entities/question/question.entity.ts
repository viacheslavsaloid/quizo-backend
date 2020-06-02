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
  @Column('text', { nullable: true })
  correctAnswer: string;

  @ApiProperty()
  @Column('int', { nullable: true })
  order: number;

  @ApiProperty({ required: false })
  @Column('text', { array: true, nullable: true })
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
