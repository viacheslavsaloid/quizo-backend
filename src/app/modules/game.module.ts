import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GAME_SERVICES } from '../services/game';
import { GAME_CONTROLLERS } from '../controllers/games';
import { AuthModule } from 'src/app/modules/auth.module';
import { GAME_REPOSITORIES } from 'src/db/repositories';

const GAME_IMPORTS = [TypeOrmModule.forFeature(GAME_REPOSITORIES), forwardRef(() => AuthModule)];
const GAME_PROVIDERS = [...GAME_SERVICES];
const GAME_EXPORTS = [...GAME_SERVICES];
@Module({
  imports: GAME_IMPORTS,
  controllers: GAME_CONTROLLERS,
  providers: [...GAME_PROVIDERS],
  exports: GAME_EXPORTS
})
export class GameModule {}
