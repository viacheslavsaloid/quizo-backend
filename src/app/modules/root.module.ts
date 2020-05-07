import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';
import { AuthModule } from 'src/app/modules/auth.module';
import { DbModule } from 'src/db/db.module';
import { ImagesModule } from 'src/app/modules/images.module';
import { GameModule } from 'src/app/modules/game.module';
import { ROOT_ROUTES } from 'src/app/shared/routes';
import { CONFIG_CONFIGS } from 'src/app/shared/configs';
import { ROOT_ROLES } from 'src/app/shared/roles';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from 'src/app/shared/filters/exceptions.filter';
import { TransformInterceptor } from 'src/app/shared/interceptor';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { TelegramModule } from './telegram.module';

const ROOT_IMPORTS = [
  ConfigModule.forRoot(CONFIG_CONFIGS),
  RouterModule.forRoutes(ROOT_ROUTES),
  AccessControlModule.forRoles(ROOT_ROLES),
  MorganModule.forRoot(),
  DbModule,
  GameModule,
  AuthModule,
  ImagesModule,
  TelegramModule
];

@Module({
  imports: ROOT_IMPORTS,
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined')
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }
  ]
})
export class RootModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HelmetMiddleware, CorsMiddleware).forRoutes('*');
  }
}
