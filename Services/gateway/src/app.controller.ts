import { Body, Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { Admin, CompressionTypes, Kafka } from 'kafkajs';
import { AppLoggerService } from 'logger/logger.service';

@Controller()
export class AppController {
  private admin: Admin;

  constructor(
    @Inject('APP_GATEWAY') private client: ClientKafka, 
  private readonly appService: AppService, private readonly logger: AppLoggerService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/fibonacci')
  async getFibo() {
    this.logger.log('debugging the log trace from ELK...', 'Gateway -> fibonacci');
    this.logger.warn('debugging the log trace from ELK...', 'Gateway -> fibonacci');
    this.logger.error('debugging the log trace from ELK...', 'Gateway -> fibonacci');
    const result = this.fibonacci(40);
    this.logger.log('debugging the log trace from ELK...', `Gateway -> fibonacci. Result: ${result}`);
    this.logger.warn('debugging the log trace from ELK...', `Gateway -> fibonacci. Result: ${result}`);
    this.logger.error('debugging the log trace from ELK...', `Gateway -> fibonacci. Result: ${result}`);
    return result;
  }

  private fibonacci(n: number) {
    return n < 1 ? 0 : n <= 2 ? 1 : this.fibonacci(n - 1) + this.fibonacci(n - 2);
  };

  private getFiboResult() {
    return new Promise(async (resolve) => {
      // const kafka = new Kafka({

      //   brokers: ['broker-1:19092'],

      // });
      // const producer = kafka.producer();

      // await producer.connect();
      // console.log("Connected successfully");

      // const result = await producer.send({
      //   topic: 'fibo',
      //   messages: [
      //     {
      //       value: JSON.stringify({ num: 40 })
      //     },
      //   ],
      //   acks: 1,
      //   compression: CompressionTypes.GZIP
      // })
      // await producer.disconnect();

      // const consumer = kafka.consumer({top}) 
      // resolve(result);

      this.client
        .send('fibo', JSON.stringify({ num: 40 }))
        .subscribe((result: number) => {
          resolve(result);
        });
    });
  }

  @Get('/microservice-fibonacci')
  async getFibonacci() {
    this.logger.log('debugging the log trace from ELK...', 'Gateway -> getFibonacci');
    this.logger.warn('debugging the log trace from ELK...', 'Gateway -> getFibonacci');
    this.logger.error('debugging the log trace from ELK...', 'Gateway -> getFibonacci');
    const fibo = await this.getFiboResult();
    this.logger.log('debugging the log trace from ELK...', `Gateway -> getFibonacci. Result: ${fibo}`);
    this.logger.warn('debugging the log trace from ELK...', `Gateway -> getFibonacci. Result: ${fibo}`);
    this.logger.error('debugging the log trace from ELK...', `Gateway -> getFibonacci. Result: ${fibo}`);
    return fibo;
  }

  async onModuleInit() {
    console.log('onModuleInit')
    this.client.subscribeToResponseOf('fibo');
    const kafka = new Kafka({
        clientId: 'app-gateway',
        brokers: ['localhost:9092'],
    });
    this.admin = kafka.admin();
    await this.admin.connect();
    const topics = await this.admin.listTopics();

    const topicList = [];
    if (!topics.includes('fibo')) {
      topicList.push({
        topic: 'fibo',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (!topics.includes('fibo.reply')) {
      topicList.push({
        topic: 'fibo.reply',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (topicList.length) {
      await this.admin.createTopics({
        topics: topicList,
      });
    }
    await this.admin.disconnect();
  }
}
