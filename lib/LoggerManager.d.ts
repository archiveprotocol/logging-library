import { Queues } from 'logging-queue-interfaces';
import { KafkaConfig } from 'kafkajs';
import { Logger } from 'log4js';
export declare enum LogLevel {
    DEBUG = "debug",
    ERROR = "error",
    INFO = "info",
    TRACE = "trace",
    WARNING = "warning"
}
export declare class LoggerManager {
    private kafkaConfig;
    protected static DEFAULT_BLUEPRINT_IDENTIFIER: string;
    protected static instances: Map<string, Logger>;
    protected static defaultInstance: Logger;
    protected constructor(kafkaConfig: KafkaConfig);
    static getLogger(): Logger;
    static getBlueprintLogger(blueprintKey: string, topic?: Queues): Logger;
    static getKafkaConfig(): KafkaConfig | null;
    static getDefaultBlueprintIdentifier(): string;
    static buildInstance(blueprintKey?: string, topic?: Queues): Logger;
    private static getKafkaManagerInstance;
}
//# sourceMappingURL=LoggerManager.d.ts.map