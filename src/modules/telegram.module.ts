import { Module } from '@nestjs/common';
import { TelegramService } from 'src/services/telegram/telegram.service';
import { GameModule } from './game.module';
import { AuthModule } from './auth.module';
import { TELEGRAM_REPOSITORIES } from 'src/db/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';

const TELEGRAM_IMPORTS = [
  TelegrafModule.forRoot({
    // token: '1156461467:AAE3RV0SRhVSqGhyiYJdbYU56q4wvPP-I_M' // prod
    token: '1127432307:AAG-gxVyFWqTqehzWqRiiuLeaBCDmWq537w' // test
  }),
  TypeOrmModule.forFeature(TELEGRAM_REPOSITORIES),
  AuthModule,
  GameModule
];

@Module({
  imports: TELEGRAM_IMPORTS,
  providers: [TelegramService]
})
export class TelegramModule {}
