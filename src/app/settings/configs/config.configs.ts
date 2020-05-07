import { ConfigModule } from '@nestjs/config';

export const CONFIG_CONFIGS: ConfigModule = {
  isGlobal: true,
  envFilePath: `src/environments/${process.env.NODE_ENV}.env`
};
