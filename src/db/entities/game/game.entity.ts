/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Round } from '../round';
import { GameType } from './game-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { TelegramAction } from '../telegram-action';
import { Player } from '../player';
@Entity('games')
export class Game extends AppBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty({ enum: GameType })
  @Column()
  type: GameType;

  @ApiProperty({ type: 'boolean' })
  @Column()
  private: boolean;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  activeRound: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  logo: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  background: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  preview: string;

  @ApiProperty({ required: false })
  @Column({ type: 'simple-array', nullable: true })
  wrongs: string[];

  @ApiProperty({ required: false })
  @Column({ type: 'simple-json', nullable: true })
  hi: {
    title: string;
    description: string;
  };

  @ApiProperty({ required: false })
  @Column({ type: 'simple-json', nullable: true })
  bye: {
    title: string;
    description: string;
  };

  @OneToMany(
    type => TelegramAction,
    telegramAction => telegramAction.game
  )
  telegramActions: TelegramAction[];

  @OneToMany(
    type => Round,
    round => round.game
  )
  rounds: Round[];

  @OneToMany(
    type => Player,
    player => player.game
  )
  players: Player[];

  @ManyToOne(
    type => User,
    user => user.ownGames
  )
  owner: User;
}
