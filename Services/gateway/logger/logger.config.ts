import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { Client } from '@elastic/elasticsearch'
import { ElasticsearchTransport } from 'winston-elasticsearch'
import * as LogstashTransport from 'winston-logstash/lib/winston-logstash-latest.js'

// const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200'

// const logstashTransport = new LogstashTransport({
//     host: 'localhost',
//     port: 28777
// })
// const esTransportOpts = {
//     level: 'info',
//     client: new Client({ node: ELASTICSEARCH_URL }),
//     indexPrefix: 'app',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//     ),
//     transformer: logData => {
//         const { meta, timestamp, ...other } = logData
//         return {
//             timestamp,
//             ...meta,
//             ...other
//         }
//     }
// }
// const elasticsearchTransport = new ElasticsearchTransport(esTransportOpts)

const transports = [
    //  elasticsearchTransport,
    // logstashTransport,
    // new winston.transports.Console({
    //     format: winston.format.combine(
    //         winston.format.timestamp(),
    //         winston.format.colorize(),
    //         winston.format.printf(({ timestamp, level, message, context, trace }) => {
    //             return `[${timestamp}] [${context}] [${level}]: ${message} ${trace ? `\n${trace}` : ''
    //                 }`;
    //         }),
    //     ),
    // }),
    // add any other transport  like
    // save logs tp ELK
    // save logs to mongodb
    // send logs to slack/teams web hook
    new winston.transports.DailyRotateFile({
        filename: 'logs/gateway-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
            winston.format.timestamp(), // Add a timestamp to file logs
            winston.format.json(),
            winston.format.printf(({ timestamp, level, message, context, trace }) => {
                return `[${timestamp}] [${context}] [${level}]: ${message} ${trace ? `\n${trace}` : ''
                    }`;
            }),
        ),
    }),
];
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports,
});