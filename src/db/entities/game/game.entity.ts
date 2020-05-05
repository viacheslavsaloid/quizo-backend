/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Round } from '../round';
import { GameType } from './game-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Player } from '../player';
@Entity('games')
export class Game extends AppBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ enum: GameType })
  @Column()
  type: GameType;

  @ApiProperty({ type: 'boolean' })
  @Column()
  private: boolean;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', nullable: true })
  activeRound: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', nullable: true })
  logo: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', nullable: true })
  background: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', nullable: true })
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
    user => user.ownGames,
    { cascade: true }
  )
  owner: User;
}
