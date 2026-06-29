import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Allow the web app to call this API from the browser if needed
  app.enableCors();
  // Default to 4000 to match the Dockerfile EXPOSE and avoid clashing with web (4000)
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
