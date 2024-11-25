import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from '@/app.module';

import { DBExceptionFilter } from './common/filter/db-exception.filter';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ResponseInterceptor } from './response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  //swagger setting
  const config = new DocumentBuilder()
    .setTitle('Ticle API server')
    .setDescription('API 서버의 api 문서입니다.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new DBExceptionFilter());
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_SERVER_PORT') ?? 3000;

  await app.listen(port);
}
bootstrap();
