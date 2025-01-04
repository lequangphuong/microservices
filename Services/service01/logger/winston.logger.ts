import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const LOGS = process.env.LOG_FOLDER ?? 'logs';

export const instance = createLogger({
  level: process.env.NODE_ENV == 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ context, timestamp, level, stack, message }) => {
      return `[CSI ${process.env.NODE_ENV ?? 'development'} - ${
        process.pid
      } - ${timestamp}] [${level.toUpperCase().padEnd(7)}] - ${context} - ${
        stack || message
      }`;
    }),
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: `all-%DATE%.log`,
      dirname: LOGS,
      datePattern: 'YYYYMMDD',
      maxSize: '1m',
      maxFiles: '60d',
      zippedArchive: false,
    }),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      filename: `exceptions-%DATE%.log`,
      dirname: LOGS,
      datePattern: 'YYYYMMDD',
      maxSize: '1m',
      maxFiles: '60d',
      zippedArchive: false,
    }),
  ],
});
