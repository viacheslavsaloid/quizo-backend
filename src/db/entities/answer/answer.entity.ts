/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Question } from './../question/question.entity';

@Entity('user')
export class Answer extends AppBaseEntity {
  @Column({ type: 'varchar', length: 50 })
  data: string;

  @ManyToOne(
    type => Question,
    question => question.answers
  )
  question: Question;

  @ManyToOne(
    type => User,
    user => user.answers
  )
  user: User;
}
