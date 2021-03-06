/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Question } from './../question/question.entity';

@Entity('answers')
export class Answer extends AppBaseEntity {
  @Column('text')
  data: string;

  @ManyToOne(
    type => Question,
    question => question.answers,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  question: Question;

  @ManyToOne(
    type => User,
    user => user.answers,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  user: User;
}
