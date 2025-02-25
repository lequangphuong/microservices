import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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
        brokers: [process.env.BROKER_SERVER],
      },
      consumer: {
        groupId: 'consumer',
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner
      }
    }
  });
  
  app.useGlobalPipes(new ValidationPipe({}))
  await app.listen();
}
bootstrap();
