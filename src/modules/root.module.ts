import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';
import { AuthModule } from 'src/modules/auth.module';
import { DbModule } from 'src/db/db.module';
import { ImagesModule } from 'src/modules/images.module';
import { GameModule } from 'src/modules/game.module';
import { ROOT_ROUTES } from 'src/shared/routes';
import { CONFIG_CONFIGS } from 'src/shared/configs';
import { ROOT_ROLES } from 'src/shared/roles';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from 'src/shared/filters/exceptions.filter';
import { TransformInterceptor } from 'src/shared/interceptor';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramModule } from './telegram.module';

const ROOT_IMPORTS = [
  ConfigModule.forRoot(CONFIG_CONFIGS),
  RouterModule.forRoutes(ROOT_ROUTES),
  AccessControlModule.forRoles(ROOT_ROLES),
  MorganModule.forRoot(),
  TelegrafModule.forRoot({
    token: '1156461467:AAE3RV0SRhVSqGhyiYJdbYU56q4wvPP-I_M'
  }),
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
