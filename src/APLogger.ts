/* eslint-disable @typescript-eslint/no-explicit-any */
import { KafkaManager } from './KafkaManager';
import * as log4js from 'log4js';
import { LogQueue, Queues } from 'logging-queue-interfaces';

interface AppenderInterface {
  stdoutAppender: (
    layout: any,
    timezoneOffset: any,
  ) => {
    (loggingEvent: log4js.LoggingEvent): void;
    shutdown(done: any): void;
  };
  configure: (
    config: any,
    layouts: any,
    findAppender: any,
    levels: any,
  ) => {
    (loggingEvent: log4js.LoggingEvent): void;
    shutdown(done: any): void;
  };
}

export function buildAppender(kafkaManager: KafkaManager, topic?: Queues, blueprintId?: string): AppenderInterface {
  const stdoutAppender = (layout, timezoneOffset) => {
    const appender = async (loggingEvent: log4js.LoggingEvent) => {
      loggingEvent.context['nodeEnv'] = process.env.NODE_ENV;
      await kafkaManager.sendLogs(
        [
          {
            message: loggingEvent.data.toString(),
            logLevel: loggingEvent.level.levelStr,
            timestamp: new Date().getTime(),
            blueprintId: blueprintId ? blueprintId : 'unknown-blueprintId',
            extras: loggingEvent.context || {},
          } as LogQueue,
        ],
        topic,
      );
      process.stdout.write(`AP-LOGGER: ${layout(loggingEvent, timezoneOffset)}\n`);
    };

    appender.shutdown = () => {};
    return appender;
  };

  const configure = (config, layouts) => {
    let layout = layouts.colouredLayout;
    if (config.layout) {
      layout = layouts.layout(config.layout.type, config.layout);
    }
    return stdoutAppender(layout, config.timezoneOffset);
  };

  return {
    stdoutAppender: stdoutAppender,
    configure: configure,
  };
}

export class APLogger {
  private readonly logger: log4js.Logger;

  constructor(appender: AppenderInterface) {
    APLogger.setLog4jsConfig(appender);
    this.logger = log4js.getLogger();
  }

  getLogger() {
    return this.logger;
  }

  static setLog4jsConfig(appender: AppenderInterface) {
    log4js.configure({
      appenders: { custom: { type: appender } },
      categories: { default: { appenders: ['custom'], level: 'debug' } },
    });
  }
}
