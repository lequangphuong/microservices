import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig, { CONFIG_DATABASE } from 'config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'logger/logger.module';


@Module({
  imports: [ConfigModule.forRoot({
    load: [databaseConfig],
    envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`
    // isGlobal: true
  }),
  LoggerModule,
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
