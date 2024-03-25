import { MyRequestConfig } from './config/axios.config';
import { Consumer, KafkaConfig, Message, Producer } from 'kafkajs';
import { LogQueue, Queues } from 'logging-queue-interfaces';
export declare class KafkaManager {
    private static instance;
    static producer: Producer;
    private _producer;
    private _isConnected;
    private acks;
    static consumer: Consumer;
    private _consumer;
    private consumerTestGroupID;
    private constructor();
    static getInstance(kafkaConfig?: KafkaConfig): KafkaManager;
    get isConnected(): boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get producer(): Producer;
    get consumer(): Consumer;
    sendResponseTimeToKafka(config: MyRequestConfig, status: number, blueprintId: string, requestId?: string, responseTimesTopic?: Queues, externalApiCallsTopic?: Queues): Promise<void>;
    sendRpcResponseTimeToKafka(rpcUrl: string, requestDuration: number, requestId?: string, responseTimesTopic?: Queues): Promise<void>;
    private stringifyQueues;
    sendLogs(msgs: LogQueue[], topic?: Queues): Promise<void>;
    sendMessage(topic: string, messages: Message[]): Promise<void>;
}
//# sourceMappingURL=KafkaManager.d.ts.map