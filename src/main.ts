import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

declare const module: any;

function setupSwagger(app) {
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Quizo')
    .setDescription('API Documentation')
    .setVersion('1.0.0')
    .addServer('Authorization', 'header')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup('/docs', app, swaggerDoc);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const mode = configService.get('MODE') || 'prod';

  setupSwagger(app);

  if (mode === 'dev') {
    app.enableCors();
  }

  await app.listen(port);
  logger.log(`Application running in ${mode} mode on port http://localhost:${port}/`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
