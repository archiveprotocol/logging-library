import { config } from 'dotenv';
import { KafkaConfig } from 'kafkajs';

config();

export const defaultKafkaConfig: KafkaConfig = {
  requestTimeout: 2000,
  retry: {
    initialRetryTime: 1000,
    retries: 1,
    maxRetryTime: 3000,
    restartOnFailure: (_e) => Promise.resolve(false),
  },
  brokers: [process.env.KAFKA_BROKER_URL],
  sasl: {
    mechanism: 'plain', // 'scram-sha-256'
    username: process.env.KAFKA_PRODUCER_USERNAME,
    password: process.env.KAFKA_PRODUCER_PASSWORD,
  },
  ssl: false,
  authenticationTimeout: 15000,
  connectionTimeout: 5000,
};
