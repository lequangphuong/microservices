import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { LoggerModule } from 'logger/logger.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule, CacheModuleAsyncOptions, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: parseInt(configService.get<string>('REDIS_PORT')!),
      },
      ttl: 10
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: `.env${process.env.NODE_ENV}`}),
    LoggerModule,
    ThrottlerModule.forRoot({ throttlers: [{ limit: 10, ttl: 60000 }] }),
    ClientsModule.register([
      {
        name: 'APP_GATEWAY',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'app-gateway',
            brokers: ['broker-1:9092'],
          },
          consumer: {
            groupId: 'kafka-microservices',
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner
          }
          // producerOnlyMode: true
        },
      },
    ]),
    CacheModule.registerAsync(RedisOptions),
  ],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor }],
})
export class AppModule { }
