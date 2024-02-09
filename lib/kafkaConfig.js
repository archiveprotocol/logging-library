"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultKafkaConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.defaultKafkaConfig = {
    requestTimeout: 2000,
    retry: {
        initialRetryTime: 1000,
        retries: 1,
        maxRetryTime: 3000,
        restartOnFailure: (_e) => Promise.resolve(false),
    },
    brokers: [process.env.KAFKA_BROKER_URL],
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_PRODUCER_USERNAME,
        password: process.env.KAFKA_PRODUCER_PASSWORD,
    },
    ssl: false,
    authenticationTimeout: 15000,
    connectionTimeout: 5000,
};
//# sourceMappingURL=kafkaConfig.js.map