import * as kafka from 'kafkajs';

export async function waitForConsumerToJoinGroup(consumer: kafka.Consumer, { maxWait = 10000, label = '' } = {}) {
  new Promise((resolve, reject) => {
    consumer.on(consumer.events.GROUP_JOIN, (event) => {
      resolve(event);
    });
    consumer.on(consumer.events.CRASH, (event) => {
      consumer.disconnect().then(() => {
        reject(event.payload.error);
      });
    });
  });
}

export function failTest() {
  expect(true).toBeFalsy();
}
