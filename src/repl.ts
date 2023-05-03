import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await repl(AppModule);
}
bootstrap().then(() =>
  console.log('Transpong is listening on port: ' + (process.env.PORT || 3000)),
);
