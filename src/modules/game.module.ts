import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GAME_SERVICES } from '../services/game';
import { GAME_CONTROLLERS } from '../controllers/games';
import { AuthModule } from 'src/modules/auth.module';
import { GameRepository } from 'src/db/repositories/game';
import { RoundRepository } from 'src/db/repositories/round';
import { QuestionRepository } from 'src/db/repositories/question';
import { AnswerRepository } from 'src/db/repositories/answer';
import { GameUserRepository } from 'src/db/repositories';

const GAME_IMPORTS = [
  TypeOrmModule.forFeature([GameRepository, RoundRepository, QuestionRepository, AnswerRepository, GameUserRepository]),
  forwardRef(() => AuthModule)
];
const GAME_PROVIDERS = [...GAME_SERVICES];
const GAME_EXPORTS = [...GAME_SERVICES];
@Module({
  imports: GAME_IMPORTS,
  controllers: GAME_CONTROLLERS,
  providers: GAME_PROVIDERS,
  exports: GAME_EXPORTS
})
export class GameModule {}
