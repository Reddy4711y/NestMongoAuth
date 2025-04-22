import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('MY API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', in: 'header', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    customCss: '.topbar {display:none}',
    customSiteTitle: 'API documentation',
    jsonDocumentUrl: 'swagger/json',
    swaggerOptions: {
      displayRequestDuration: true,
    },
  });

  app.getHttpAdapter().getInstance().disable('x-powered-by');
  const origins = process.env.ALLOW_ORIGINS?.split(',');
  console.log(origins);

  app.enableCors({
    origin: origins,
    credentials: true,
  });
}
