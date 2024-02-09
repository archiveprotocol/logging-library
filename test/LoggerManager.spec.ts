import { APLogger, buildAppender } from '../src/APLogger';
import { KafkaManager } from '../src/KafkaManager';
import { LoggerManager } from '../src/LoggerManager';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { KafkaConfig } from 'kafkajs';

describe('LoggerManager', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'dev';
    jest.mock('@src/KafkaManager', () => {
      return {
        KafkaManager: jest.fn().mockImplementation(() => {
          return {
            //new: () => Substitute.for<KafkaManager>(),
            buildKafkaProducer: (kafkaConfig) => undefined,
          };
        }),
      };
    });
  });

  it('should be able to log correctly', async function () {
    LoggerManager.getKafkaConfig = jest.fn().mockReturnValue({
      brokers: ['dummy'],
    } as KafkaConfig);
    LoggerManager.getDefaultBlueprintIdentifier = jest.fn().mockReturnValue('dummy');

    // We mock kafka to not trigger Kafka requests.
    const mockKafkaManager = Substitute.for<KafkaManager>();
    const testAppender = buildAppender(mockKafkaManager);
    const mockApLogger = new APLogger(testAppender);
    LoggerManager.buildInstance = jest.fn().mockReturnValue(mockApLogger);

    const logger = LoggerManager.getLogger();
    expect(logger).toBeDefined();

    const blueprintLogger = LoggerManager.getBlueprintLogger('test-blueprint');
    expect(blueprintLogger).toBeDefined();
  });
});
