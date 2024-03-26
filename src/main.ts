import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { QueryErrorFilter } from './options/catch-error.options';
import * as passport from 'passport'
import * as session from 'express-session';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PREFIX = '/api/v1';

  // Setting global pipe
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        for (const error of errors) {
          delete error.value;
          delete error.target;
        }
        return new BadRequestException(errors);
      },
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000
      }
    }))
  app.use(passport.initialize());

  app.use(passport.session());

  // Setting global prefix
  app.setGlobalPrefix(PREFIX);
  const config = app.get(ConfigService);

  // Swagger configuration
  const swagger = new DocumentBuilder()
    .setTitle('Upbilim backend')
    .setDescription('The API description')
    .setVersion('1.0')
    .setBasePath(PREFIX)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('/api/v1/swagger', app, document);

  // Global validation filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new QueryErrorFilter(httpAdapter));

  // Cors enable
  app.enableCors();

  // Setting port from .env
  const PORT = config.get<number>('PORT') || 8000;

  await app.listen(PORT, () =>
    console.log(`The server has been started on ${PORT} port`),
  );
}
bootstrap();
