import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { TEMPLATES_CONTROLLERS } from 'src/app/controllers/templates';
import { TEMPLATE_MULTER_CONFIGS } from '../settings/configs/templates-multer.configs';

const TEMPLATES_IMPORTS = [MulterModule.register(TEMPLATE_MULTER_CONFIGS)];

@Module({
  imports: TEMPLATES_IMPORTS,
  controllers: TEMPLATES_CONTROLLERS
})
export class TemplatesModule {}
