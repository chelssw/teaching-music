import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prefix = process.env.API_PREFIX ?? 'api';
  const port = Number(process.env.API_PORT ?? 3000);
  app.enableCors({ origin: 'http://localhost:4200' });
  app.setGlobalPrefix(prefix);
  await app.listen(port);
}
bootstrap();
