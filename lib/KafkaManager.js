"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaManager = void 0;
const kafkaConfig_1 = require("./kafkaConfig");
const kafkajs_1 = require("kafkajs");
const logging_queue_interfaces_1 = require("logging-queue-interfaces");
class KafkaManager {
    constructor(kafkaConfig) {
        this._isConnected = false;
        this.acks = 0;
        this.consumerTestGroupID = 'test-kafka-manager';
        this.stringifyQueues = (array) => array.map((r) => {
            return { value: JSON.stringify(r) };
        });
        const kafkaClient = new kafkajs_1.Kafka(kafkaConfig !== null && kafkaConfig !== void 0 ? kafkaConfig : kafkaConfig_1.defaultKafkaConfig);
        this._producer = kafkaClient.producer();
        this._consumer = kafkaClient.consumer({ groupId: this.consumerTestGroupID });
    }
    static getInstance(kafkaConfig) {
        if (!KafkaManager.instance) {
            KafkaManager.instance = new KafkaManager(kafkaConfig);
        }
        return KafkaManager.instance;
    }
    get isConnected() {
        return this._isConnected;
    }
    async connect() {
        try {
            await this._producer.connect();
            this._isConnected = true;
        }
        catch (err) {
            console.error('KafkaManager Error: producer failed to connect to broker', err, err.trace);
        }
    }
    async disconnect() {
        try {
            const kafkaManager = KafkaManager.getInstance();
            if (kafkaManager.isConnected) {
                const producer = kafkaManager.producer;
                await producer.disconnect();
                const consumer = kafkaManager.producer;
                await consumer.disconnect();
            }
        }
        catch (err) {
            console.error('Failed to disconnect kafka client', err);
        }
    }
    get producer() {
        return this._producer;
    }
    get consumer() {
        return this._consumer;
    }
    async sendResponseTimeToKafka(config, status, blueprintId, requestId, responseTimesTopic = logging_queue_interfaces_1.Queues.RESPONSE_TIMES, externalApiCallsTopic = logging_queue_interfaces_1.Queues.EXTERNAL_API_CALLS) {
        if (!['staging', 'production'].includes(process.env.NODE_ENV))
            return;
        const timestamp = Math.floor(new Date().getTime());
        const requestDuration = config.metadata.duration;
        const responseTime = {
            url: config.url,
            blueprintId: blueprintId,
            // TODO  i can only presume indexerId was supposed to be a unique identifier for each AP producer instance
            indexerId: 'INDEXER-ID',
            responseStatusCode: status,
            responseTimeMs: requestDuration,
            timestamp: timestamp,
            extras: {
                requestId: requestId,
                nodeEnv: process.env.NODE_ENV,
            },
        };
        const externalApiCall = {
            url: config.url,
            timestamp: responseTime.timestamp,
            blueprintId: blueprintId,
            runSessionId: 'kafka-rest-manager-run-session-id',
            extras: {
                requestId: requestId,
            },
        };
        const responseTimeQueuesAsJson = this.stringifyQueues([responseTime]);
        const externalApiCallAsJson = this.stringifyQueues([externalApiCall]);
        this.sendMessage(responseTimesTopic, responseTimeQueuesAsJson);
        this.sendMessage(externalApiCallsTopic, externalApiCallAsJson);
    }
    async sendRpcResponseTimeToKafka(rpcUrl, requestDuration, requestId, responseTimesTopic = logging_queue_interfaces_1.Queues.RESPONSE_TIMES) {
        if (!['staging', 'production'].includes(process.env.NODE_ENV))
            return;
        const timestamp = Math.floor(new Date().getTime());
        const responseTime = {
            url: rpcUrl,
            blueprintId: 'defaultBlueprintId',
            // TODO  i can only presume indexerId was supposed to be a unique identifier for each AP producer instance
            indexerId: 'INDEXER-ID',
            responseStatusCode: -1,
            responseTimeMs: Math.trunc(requestDuration),
            timestamp: timestamp,
            extras: {
                requestId: requestId,
                nodeEnv: process.env.NODE_ENV,
            },
        };
        const responseTimeQueuesAsJson = this.stringifyQueues([responseTime]);
        this.sendMessage(responseTimesTopic, responseTimeQueuesAsJson);
    }
    async sendLogs(msgs, topic = logging_queue_interfaces_1.Queues.LOGS) {
        await this.sendMessage(topic, msgs.map((msg) => {
            return {
                key: msg.blueprintId,
                value: JSON.stringify(msg),
            };
        }));
    }
    // TODO disconnecting before app shuts down https://stackoverflow.com/questions/67243831/do-we-need-to-connect-everytime-we-producer-kafka-message
    async sendMessage(topic, messages) {
        if (!this.isConnected) {
            await this.connect();
        }
        await this.producer.send({
            topic,
            messages,
            acks: this.acks,
        });
    }
}
exports.KafkaManager = KafkaManager;
//# sourceMappingURL=KafkaManager.js.map