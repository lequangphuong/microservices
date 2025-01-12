import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({}))
  app.enableVersioning({ type: VersioningType.URI })
  app.use(helmet())
  app.use(compression())

  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT')), () => {
    console.log(`🚀 Application running at port ${configService.get('PORT')}`)
  };
}
bootstrap();
