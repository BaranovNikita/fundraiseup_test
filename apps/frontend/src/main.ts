import { NestFactory } from '@nestjs/core';
import { FrontendModule } from './frontend.module';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(FrontendModule);
  app.setBaseViewsDir(path.join(__dirname, '..', 'frontend', 'views'));
  app.setViewEngine('hbs');
  await app.listen(8000);
}
bootstrap();
