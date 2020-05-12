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
    { cascade: true }
  )
  question: Question;

  @ManyToOne(
    type => User,
    user => user.answers,
    { cascade: true }
  )
  user: User;
}
