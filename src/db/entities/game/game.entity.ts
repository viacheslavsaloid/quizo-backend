/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, OneToOne, JoinTable } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Round } from '../round';
import { GameType } from './game-type.enum';
import { IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { ApiProperty } from '@nestjs/swagger';
import { GameUser } from '../game-user';

const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('games')
export class Game extends AppBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty({ enum: GameType })
  @Column()
  type: GameType;

  @ApiProperty({ required: false })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ type: 'varchar', length: 50, nullable: true })
  activeRound: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ type: 'varchar', length: 100, nullable: true })
  logo: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ type: 'varchar', length: 100, nullable: true })
  background: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ type: 'varchar', length: 100, nullable: true })
  preview: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ type: 'simple-array', nullable: true })
  wrongs: string[];

  @ApiProperty({ required: false })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ type: 'simple-json', nullable: true })
  hi: {
    title: string;
    description: string;
  };

  @ApiProperty({ required: false })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ type: 'simple-json', nullable: true })
  bye: {
    title: string;
    description: string;
  };

  @OneToMany(
    type => Round,
    round => round.game,
    { onDelete: 'CASCADE' }
  )
  rounds: Round[];

  @OneToMany(
    type => GameUser,
    gameUser => gameUser.game
  )
  players: GameUser[];

  @ManyToOne(
    type => User,
    user => user.ownGames,
    { onDelete: 'CASCADE' }
  )
  owner: User;
}
