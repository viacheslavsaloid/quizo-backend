import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';
import { AuthModule } from 'src/app/modules/auth.module';
import { DbModule } from 'src/db/db.module';
import { ImagesModule } from 'src/app/modules/images.module';
import { GameModule } from 'src/app/modules/game.module';
import { ROOT_ROUTES } from 'src/app/routes';
import { CONFIG_CONFIGS } from 'src/app/settings/configs';
import { ROLES_PERMISSIONS } from 'src/app/utils/permissions';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from 'src/app/utils/filters/exceptions.filter';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { TelegramModule } from './telegram.module';
import { TransformInterceptor } from '../interceptors';
import { SocketModule } from './socket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TemplatesModule } from './templates.module';

const ROOT_IMPORTS = [
  ConfigModule.forRoot(CONFIG_CONFIGS),
  RouterModule.forRoutes(ROOT_ROUTES),
  AccessControlModule.forRoles(ROLES_PERMISSIONS),
  MorganModule.forRoot(),
  SocketModule,
  DbModule,
  GameModule,
  AuthModule,
  ImagesModule,
  TelegramModule,
  TemplatesModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', '..', 'templates'),
    serveRoot: '/templates',
  }),
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
