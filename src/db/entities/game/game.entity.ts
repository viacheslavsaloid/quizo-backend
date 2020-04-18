/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { AppBaseEntity } from '../base';
import { User } from '../user';
import { Round } from '../round';

@Entity('games')
export class Game extends AppBaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @OneToMany(
    type => Round,
    round => round.game,
    { onDelete: 'CASCADE' }
  )
  rounds: Round[];

  @ManyToOne(
    type => User,
    user => user.games,
    { onDelete: 'CASCADE' }
  )
  user: User;
}
