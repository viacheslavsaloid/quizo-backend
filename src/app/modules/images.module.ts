import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MULTER_CONFIGS } from 'src/app/settings/configs';
import { IMAGES_CONTROLLERS } from 'src/app/controllers/images';

const IMAGES_IMPORTS = [MulterModule.register(MULTER_CONFIGS)];

@Module({
  imports: IMAGES_IMPORTS,
  controllers: IMAGES_CONTROLLERS
})
export class ImagesModule {}
