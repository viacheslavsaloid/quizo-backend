/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Question } from './../question/question.entity';

@Entity('answers')
export class Answer extends AppBaseEntity {
  @Column({ type: 'varchar', length: 50 })
  data: string;

  @ManyToOne(
    type => Question,
    question => question.answers,
    { onDelete: 'CASCADE' }
  )
  question: Question;

  @ManyToOne(
    type => User,
    user => user.answers,
    { onDelete: 'CASCADE' }
  )
  user: User;
}
