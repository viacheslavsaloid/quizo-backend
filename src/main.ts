import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const mode = configService.get('MODE') || 'prod';

  if (mode === 'dev') {
    app.enableCors();

    const document = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('Quizo API').build());

    SwaggerModule.setup('docs', app, document);
  } else {
  }

  await app.listen(port);
  logger.log(`Application running in ${mode} mode on port http://localhost:${port}/`);
}
bootstrap();
