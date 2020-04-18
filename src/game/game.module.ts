import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GAME_SERVICES } from './services';
import { GAME_CONTROLLERS } from './controllers';
import { AuthModule } from 'src/auth/auth.module';
import { GameRepository, RoundRepository, QuestionRepository, AnswerRepository } from 'src/db/repositories';

const GAME_IMPORTS = [
  TypeOrmModule.forFeature([GameRepository, RoundRepository, QuestionRepository, AnswerRepository]),
  AuthModule
];
const GAME_PROVIDERS = [...GAME_SERVICES];
@Module({
  imports: GAME_IMPORTS,
  controllers: GAME_CONTROLLERS,
  providers: GAME_PROVIDERS
})
export class GameModule {}
