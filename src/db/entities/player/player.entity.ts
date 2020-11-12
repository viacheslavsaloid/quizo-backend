/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Game } from '../game';
import { ApiProperty } from '@nestjs/swagger';

@Entity('players')
export class Player extends AppBaseEntity {
  @ApiProperty({ required: false })
  @Column('jsonb', { default: () => "'[]'", })
  history: [{
    action: string,
    date: Date,
    description: string
  }];

  @Column('boolean', { default: true })
  access: boolean;

  @Column('text')
  role: 'leader' | 'team';

  @ManyToOne(
    type => User,
    user => user.accessGames,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  user: User;

  @ManyToOne(
    type => Game,
    game => game.players,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  game: Game;

  @ManyToOne(
    type => Player,
    player => player.team,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  leader: Player;

  @OneToMany(
    type => Player,
    player => player.leader,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  team: Player[];
}
