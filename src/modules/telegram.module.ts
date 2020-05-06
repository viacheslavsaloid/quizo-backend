import { Module } from '@nestjs/common';
import { TelegramService } from 'src/services/telegram/telegram.service';
import { GameModule } from './game.module';
import { AuthModule } from './auth.module';
import { TELEGRAM_REPOSITORIES } from 'src/db/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { TELEGRAM_CONFIGS } from 'src/shared/configs'

const TELEGRAM_IMPORTS = [
  TelegrafModule.forRootAsync(TELEGRAM_CONFIGS),
  TypeOrmModule.forFeature(TELEGRAM_REPOSITORIES),
  AuthModule,
  GameModule
];

@Module({
  imports: TELEGRAM_IMPORTS,
  providers: [TelegramService]
})
export class TelegramModule {}
