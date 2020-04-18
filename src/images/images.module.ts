import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { IMAGES_CONTROLLERS } from './controllers';
import { MULTER_CONFIGS } from './configs';

const IMAGES_IMPORTS = [MulterModule.register(MULTER_CONFIGS)];

@Module({
  imports: IMAGES_IMPORTS,
  controllers: IMAGES_CONTROLLERS
})
export class ImagesModule {}
