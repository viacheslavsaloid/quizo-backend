import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';

export const ORM_CONFIGS = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    console.log(configService.get('ORM_TYPE'))
    return {
      type: configService.get<'postgres'>('ORM_TYPE'),
      host: configService.get('ORM_HOST'),
      port: configService.get<number>('ORM_PORT'),
      username: configService.get('ORM_USER'),
      password: configService.get('ORM_PASSWORD'),
      database: configService.get<string>('ORM_DATABASE'),
      entities: [__dirname + '/../../../**/*.entity.{js,ts}'],
      synchronize: configService.get('MODE') === 'dev',
      ssl: configService.get('MODE') === 'prod' ? {
        "rejectUnauthorized": false,
      } : null,
    }
  }
};
