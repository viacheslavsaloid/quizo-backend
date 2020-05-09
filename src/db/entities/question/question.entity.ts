/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../base';
import { Round } from '../round';
import { Answer } from '../answer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('questions')
export class Question extends AppBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar' })
  title: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', nullable: true })
  correctAnswer: string;

  @ApiProperty({ required: false })
  @Column({ type: 'simple-array', nullable: true })
  medias: string[];

  @OneToMany(
    type => Answer,
    answer => answer.question
  )
  answers: Answer[];

  @ManyToOne(
    type => Round,
    round => round.questions,
    { cascade: true }
  )
  round: Round;
}
