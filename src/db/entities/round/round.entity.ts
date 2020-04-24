/* eslint-disable @typescript-eslint/no-unused-vars */
import { Question } from './../question/question.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../base';
import { Game } from '../game';
import { IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { ApiProperty } from '@nestjs/swagger';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('rounds')
export class Round extends AppBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty()
  @Column({ type: 'integer' })
  order: number;

  @ApiProperty({ required: false })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ type: 'simple-array', nullable: true })
  hints: string[];

  @OneToMany(
    type => Question,
    question => question.round,
    { onDelete: 'CASCADE' }
  )
  questions: Round[];

  @ManyToOne(
    type => Game,
    game => game.rounds,
    { onDelete: 'CASCADE' }
  )
  game: Game;
}
