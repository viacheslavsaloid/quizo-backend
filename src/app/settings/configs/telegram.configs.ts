

import { ConfigModule, ConfigService } from '@nestjs/config';

export const TELEGRAM_CONFIGS = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    token: configService.get('TELEGRAM_TOKEN'),
  })
};
