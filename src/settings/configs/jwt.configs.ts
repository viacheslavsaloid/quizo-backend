import { ConfigModule, ConfigService } from '@nestjs/config';

export const JWT_CONFIGS = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: { expiresIn: '365d' }
  })
};
