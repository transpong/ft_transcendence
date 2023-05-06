import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap().then(() =>
  console.log('Transpong is listening on port: ' + (process.env.PORT || 3000)),
);
