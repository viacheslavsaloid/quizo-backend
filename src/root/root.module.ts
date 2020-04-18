import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { CONFIG_CONFIGS } from './configs';
import { AuthModule } from 'src/auth/auth.module';
import { ROOT_ROUTES } from './routes';
import { DbModule } from 'src/db/db.module';
import { ImagesModule } from 'src/images/images.module';
import { GameModule } from 'src/game/game.module';

const ROOT_IMPORTS = [
  ConfigModule.forRoot(CONFIG_CONFIGS),
  RouterModule.forRoutes(ROOT_ROUTES),
  DbModule,
  AuthModule,
  GameModule,
  ImagesModule
];

@Module({
  imports: ROOT_IMPORTS
})
export class RootModule {}
