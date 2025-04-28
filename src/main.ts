import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('port ', process.env.PORT);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  console.log('server started successfully');
  console.log(`server started on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
