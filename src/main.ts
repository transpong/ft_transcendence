import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GatewayAdapter } from './gateway/adapter/gateway.adapter';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/service/user.service';
import { GameService } from './game/service/game.service';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: [process.env.FRONTEND_URL, 'http://api.intra.42.fr'],
    credentials: true,
    optionSuccessStatus: 200,
  };

  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(
    new GatewayAdapter(app.get(JwtService), app.get(UserService), app),
  );

  const gameService = app.get(GameService);
  await gameService.cleanupUnfinishedMatches();

  await app.listen(process.env.PORT || 3000);
}

bootstrap().then(() =>
  console.log('Transpong is listening on port: ' + (process.env.PORT || 3000)),
);
