import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { LoggerModule } from 'logger/logger.module';

@Module({
  imports: [ConfigModule.forRoot(),
    LoggerModule,
  // ThrottlerModule.forRoot({ throttlers: [{ limit: 10, ttl: 60 }] }),
  // ClientsModule.register([
  //   {
  //     name: 'APP_GATEWAY',
  //     transport: Transport.KAFKA,
  //     options: {
  //       client: {
  //         clientId: 'app-gateway',
  //         brokers: ['broker-1:19092'],
  //       },
  //       consumer: {
  //         groupId: 'kafka-microservices',
  //       },
  //       producer: {
  //         createPartitioner: Partitioners.LegacyPartitioner
  //       }
  //       // producerOnlyMode: true
  //     },
  //   },
  // ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
