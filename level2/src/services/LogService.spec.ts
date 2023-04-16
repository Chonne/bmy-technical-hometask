import LogService from './LogService';
import * as redisLib from '../lib/redis';
import * as slowComputationLib from '../lib/slowComputation';

describe('LogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseLogAndSendLogToRedis', () => {
    it('should parse a valid log and send it to Redis', async () => {
      const logRequestBody = {
        log: [
          'sample#id=12345',
          'sample#service_name=example',
          'sample#process=web.1',
          'sample#load_avg_1m=0.1',
          'sample#load_avg_5m=0.2',
          'sample#load_avg_15m=0.3',
        ],
      };

      const expectedLogObject = {
        id: '12345',
        service_name: 'example',
        process: 'web.1',
        load_avg_1m: '0.1',
        load_avg_5m: '0.2',
        load_avg_15m: '0.3',
        slow_computation: '',
      };

      const expectedLogObjectWithSlowComputation = {
        ...expectedLogObject,
        slow_computation: '0.0009878',
      };

      const logService = new LogService();

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const sendToListMock = jest
        .spyOn(redisLib, 'sendToList')
        .mockResolvedValueOnce(undefined);
      const computeMock = jest
        .spyOn(slowComputationLib, 'compute')
        .mockResolvedValueOnce(expectedLogObjectWithSlowComputation);

      await logService.parseLogAndSendLogToRedis(logRequestBody);

      expect(computeMock).toHaveBeenCalledWith(expectedLogObject);
      expect(sendToListMock).toHaveBeenCalledWith(
        expectedLogObjectWithSlowComputation,
      );
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should log a warning for an invalid log item', async () => {
      const logRequestBody = {
        log: ['sample#id=12345', 'sample#service_name=example', 'invalid_item'],
      };

      const expectedLogObject = {
        id: '12345',
        service_name: 'example',
        process: '',
        load_avg_1m: '',
        load_avg_5m: '',
        load_avg_15m: '',
        slow_computation: '',
      };

      const expectedLogObjectWithSlowComputation = {
        ...expectedLogObject,
        slow_computation: '0.0009878',
      };

      const logService = new LogService();

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const sendToListMock = jest
        .spyOn(redisLib, 'sendToList')
        .mockResolvedValueOnce(undefined);
      const computeMock = jest
        .spyOn(slowComputationLib, 'compute')
        .mockResolvedValueOnce(expectedLogObjectWithSlowComputation);

      await logService.parseLogAndSendLogToRedis(logRequestBody);

      expect(computeMock).toHaveBeenCalledWith(expectedLogObject);
      expect(sendToListMock).toHaveBeenCalledWith(
        expectedLogObjectWithSlowComputation,
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Unexpected log item: invalid_item',
      );

      consoleSpy.mockRestore();
    });
  });
});
