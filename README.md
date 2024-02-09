# Logging Library

This library is intended to be imported by other libraries which wish to log/stream relevant information as part of the blueprint execution, such as message logs, billing entries, API requests, among others.

## How to use

Add this package as a dependency to `package.json`

## Main classes

- APAxiosManager:
  - This class exposes an [axios](https://axios-http.com/) instance that should be used during blueprint executions.
- APLogger:
  - This class exposes a logger property that should be used during blueprint executions.

## Minimal example

Logging a message (from [test file](./test/APLogger.spec.ts)):

```typescript
// Username and password should have enough permission to produce messages.
const kafkaManager = new KafkaManager(broker_url, username, password);
const testAppender = buildAppender(kafkaManager);
const apLogger = new APLogger(testAppender);
const logger = apLogger.getLogger();
const msg = `test-${Math.random().toString()}`;
logger.info(msg);
```

Sending a request using the axios instance (from [test file](./test/APAxiosManager.spec.ts)):

```typescript
const kafkaManager = new KafkaManager(broker_url, username, password);
const blueprintId = 'MOCK-BLUEPRINT-ID';
const am = new APAxiosManager(kafkaManager, blueprintId);
const url = 'https://jsonplaceholder.typicode.com/todos/1';
await am._axios.get(url);
```
