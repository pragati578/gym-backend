import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { ENV, PORT } from './constant';
async function bootstrap() {
  // CORS is enabled
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  if (ENV === 'development') {
    // Swagger API Documentation
    const config = new DocumentBuilder()
      .setTitle('Gym Backend')
      .setDescription('Gym Backend APIs')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  // Request Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(requestIp.mw());

  // Helmet Middleware against known security vulnerabilities
  app.use(helmet());

  // CORS setup
  app.enableCors({
    origin: ENV === 'development' ? '*' : process.env.FRONTEND_URL,
  });

  await app.listen(PORT, '127.0.0.1');
}

bootstrap();
