/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { AppBaseEntity } from '../base';
import { Round } from '../round';
import { Answer } from '../answer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('questions')
export class Question extends AppBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  correctAnswer: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  media: string;

  @OneToMany(
    type => Answer,
    answer => answer.question,
    { onDelete: 'CASCADE' }
  )
  answers: Answer[];

  @ManyToOne(
    type => Round,
    round => round.questions,
    { onDelete: 'CASCADE' }
  )
  round: Round;
}
