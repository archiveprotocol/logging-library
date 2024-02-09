import { APLogger, buildAppender } from '../src/APLogger';
import { KafkaManager } from '../src/KafkaManager';
import { createMock } from '@golevelup/ts-jest';

describe('Logger', () => {
  it('should be able to log correctly', async function () {
    const mockKafkaManager = createMock<KafkaManager>();
    const testAppender = buildAppender(mockKafkaManager);
    const apLogger = new APLogger(testAppender);
    const logger = apLogger.getLogger();
    const msg = `test-282828`;
    logger.addContext('requestId', 'request1223');
    logger.info(msg);

    expect(mockKafkaManager.sendLogs.mock.calls).toHaveLength(1);
    // The first arg of the first call to the function
    const callArgs = mockKafkaManager.sendLogs.mock.calls[0][0];
    expect(callArgs[0]['blueprintId']).toBe('unknown-blueprintId');
    expect(callArgs[0]['logLevel']).toBe('INFO');
    expect(callArgs[0]['message']).toBe(msg);
    expect(callArgs[0]['timestamp']).toBeLessThanOrEqual(new Date().getTime());
    expect(callArgs[0]['timestamp']).toBeGreaterThan(new Date().getTime() - 10000); // -10 secs from now
    expect(callArgs[0]['extras']!['requestId']).toBe('request1223');
    expect(callArgs[0]['extras']!['nodeEnv']).toBe('staging');
  });
});
