import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: ['http://localhost:5173', 'http://api.intra.42.fr'],
    credentials: true,
    optionSuccessStatus: 200,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 3000);
}

bootstrap().then(() =>
  console.log('Transpong is listening on port: ' + (process.env.PORT || 3000)),
);
