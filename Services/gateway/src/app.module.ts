import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { LoggerModule } from 'logger/logger.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CONFIG_KAFKA } from 'config/kafka.config';
import { configuration } from 'config/config';


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
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration]
    }),
    LoggerModule,
    ThrottlerModule.forRoot({ throttlers: [{ limit: 10, ttl: 60000 }] }),
    ClientsModule.register([{
      name: CONFIG_KAFKA,
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'app-gateway',
          brokers: [process.env.BROKER_SERVER],
        },
        consumer: {
          groupId: 'kafka-microservices',
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner
        }
      },
    }]),
    CacheModule.registerAsync(RedisOptions),
  ],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor }],
})
export class AppModule { }
