import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrapApi() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text({}));

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!['localhost'].some((item) => origin.includes(item))) {
        const message =
          "The CORS policy for this origin doesn't allow access from the particular origin.";
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
    credentials: true,
    exposedHeaders: ['content-disposition'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(8001, () => console.log('listen api 8001'));
}
bootstrapApi();
