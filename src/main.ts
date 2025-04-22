import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import { customValidationPipe } from './validation-pipe.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  app.useGlobalPipes(customValidationPipe);

  const port = process.env.PORT ?? 3000;

  await app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`),
  );
}

bootstrap();
