/* eslint-disable @typescript-eslint/ban-ts-comment */
import { KafkaManager } from '../src/KafkaManager';
import { waitForConsumerToJoinGroup } from './utils';
import { config } from 'dotenv';
import { Consumer } from 'kafkajs';

config();

describe.skip('Kafka manager', () => {
  const testTopic = 'test_topic_1234567';
  const testRequestId = 'b686e6f9-39a4-4725-9156-ad62b79d770c';
  let kafkaManager: KafkaManager;
  let consumer: Consumer;

  beforeAll(async () => {
    kafkaManager = KafkaManager.getInstance();
    consumer = kafkaManager.consumer;
    await consumer.connect();
    await consumer.subscribe({ topics: [testTopic] });
  }, 60_000);

  afterAll(async () => {
    consumer && (await consumer.disconnect());
    kafkaManager.producer && (await kafkaManager.producer.disconnect());
  }, 10000);

  it('to send response time', async () => {
    const messagesConsumed: any[] = [];
    await consumer.run({
      eachMessage: async ({ message }) => {
        // We expect any message to be received
        const msg = JSON.parse(new TextDecoder().decode(message.value!));
        messagesConsumed.push(msg);
      },
    });
    await waitForConsumerToJoinGroup(consumer);
    await kafkaManager.sendResponseTimeToKafka(
      {
        url: 'my-url',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        headers: null,
        metadata: {
          startTime: new Date('2023-01-01'),
          duration: 10,
        },
      },
      200,
      'blueprintId',
      testRequestId,
      // @ts-ignore
      testTopic,
      // @ts-ignore
      testTopic,
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(messagesConsumed.length).toBeGreaterThan(0);
  }, 60_000);
});
