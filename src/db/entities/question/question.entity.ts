/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Round } from '../round';
import { Answer } from '../answer';

@Entity('questions')
export class Question extends AppBaseEntity {
  @Column({ type: 'varchar', length: 50 })
  data: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  correctAnswer: string;

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
