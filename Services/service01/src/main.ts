import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { instance } from 'logger/winston.logger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `consumer-${uuidv4()}`,
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'consumer',
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner
      }
    },
    logger:
      process.env.NODE_ENV == 'development'
        ? ['debug', 'error', 'log', 'warn']
        : WinstonModule.createLogger({
          instance: instance,
        }),
  });
  
  app.useGlobalPipes(new ValidationPipe({}))
  await app.listen();
}
bootstrap();
