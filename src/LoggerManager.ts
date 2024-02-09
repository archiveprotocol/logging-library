import { Queues } from 'logging-queue-interfaces';
import { APLogger, buildAppender } from './APLogger';
import { KafkaManager } from './KafkaManager';
import { KafkaConfig } from 'kafkajs';
import { Level, Logger } from 'log4js';

export enum LogLevel {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info',
  TRACE = 'trace',
  WARNING = 'warning',
}

export class LoggerManager {
  protected static DEFAULT_BLUEPRINT_IDENTIFIER = 'unknown-identifier';
  protected static instances: Map<string, Logger> = new Map();
  protected static defaultInstance: Logger;

  protected constructor(private kafkaConfig: KafkaConfig) {}

  public static getLogger(): Logger {
    if (!this.defaultInstance) {
      this.defaultInstance = this.buildInstance();
    }
    return this.defaultInstance;
  }

  public static getBlueprintLogger(blueprintKey: string, topic?: Queues): Logger {
    if (!this.instances.has(blueprintKey)) {
      this.instances.set(blueprintKey, this.buildInstance(blueprintKey));
    }

    APLogger.setLog4jsConfig(buildAppender(this.getKafkaManagerInstance(), topic, blueprintKey))
    return this.instances.get(blueprintKey);
  }

  // override in ArchiveLogger subclass with desired config, otherwise uses defaults
  public static getKafkaConfig(): KafkaConfig | null {
    return null;
  }

  public static getDefaultBlueprintIdentifier(): string {
    throw new Error('To be implemented by subclass');
  }

  public static buildInstance(blueprintKey?: string, topic?: Queues) {
    const kafkaManager = this.getKafkaManagerInstance();
    const identifier = blueprintKey ? blueprintKey : this.getDefaultBlueprintIdentifier();
    const instance = new APLogger(buildAppender(kafkaManager, topic, identifier)).getLogger();

    // mock logging in test and development environment
    if (!['staging', 'production'].includes(process.env.NODE_ENV)) {
      instance.log = (level: Level | string, ...args: any[]): void => {
        console.log(level, ...args);
      };
    }
    return instance;
  }

  private static getKafkaManagerInstance() {
    return KafkaManager.getInstance(LoggerManager.getKafkaConfig());
  }
}
