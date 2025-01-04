import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import databaseConfig, { CONFIG_DATABASE } from 'config/database.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot({
    load: [databaseConfig],
    envFilePath: '.env',
    isGlobal: true
  }),
  // ThrottlerModule.forRoot({ throttlers: [{ limit: 10, ttl: 60 }] }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      return {
        uri: configService.get(CONFIG_DATABASE).users.uri,
        dbName: configService.get(CONFIG_DATABASE).users.dbName
      }
    },
    inject: [ConfigService]
  })
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule { }
