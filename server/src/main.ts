import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function start() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: process.env.CLIENT_URL
    }
  });
  app.use(cookieParser())

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
start();
