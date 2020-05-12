/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../base';

@Entity('telegram-media')
export class TelegramMedia extends AppBaseEntity {
  @Column('text')
  file_path: string;

  @Column('text')
  file_id: string;
}
