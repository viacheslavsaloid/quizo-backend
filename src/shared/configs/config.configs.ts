import { ConfigModule } from '@nestjs/config';

export const CONFIG_CONFIGS: ConfigModule = {
  isGlobal: true,
  envFilePath: `environments/${process.env.NODE_ENV}.env`
};
