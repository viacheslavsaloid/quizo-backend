import { Module, forwardRef } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';
import { AuthModule } from 'src/modules/auth.module';
import { DbModule } from 'src/db/db.module';
import { ImagesModule } from 'src/modules/images.module';
import { GameModule } from 'src/modules/game.module';
import { ROOT_ROUTES } from 'src/routes';
import { CONFIG_CONFIGS } from 'src/settings/configs';
import { ROOT_ROLES } from 'src/roles';

const ROOT_IMPORTS = [
  ConfigModule.forRoot(CONFIG_CONFIGS),
  RouterModule.forRoutes(ROOT_ROUTES),
  AccessControlModule.forRoles(ROOT_ROLES),
  DbModule,
  GameModule,
  AuthModule,
  ImagesModule
];

@Module({
  imports: ROOT_IMPORTS
})
export class RootModule {}
