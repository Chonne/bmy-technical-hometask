import LogService from './LogService';
import { writeLogToFile } from '../lib/fs';

jest.mock('../lib/fs', () => ({
  writeLogToFile: jest.fn(),
}));

describe('LogService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseLogAndWriteToFile', () => {
    it('should parse the log and write it to a file', async () => {
      const logService = new LogService();

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const logRequestBody = {
        log: [
          'sample#id=1',
          'sample#service_name=example',
          'sample#process=worker',
          'load_avg_1m=0.1',
          'load_avg_5m=0.2',
          'load_avg_15m=0.3',
        ],
      };

      await logService.parseLogAndWriteToFile(logRequestBody);

      expect(writeLogToFile).toHaveBeenCalledTimes(1);
      expect(writeLogToFile).toHaveBeenCalledWith({
        id: '1',
        service_name: 'example',
        process: 'worker',
        load_avg_1m: '0.1',
        load_avg_5m: '0.2',
        load_avg_15m: '0.3',
      });

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle unexpected log items', async () => {
      const logService = new LogService();

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const logRequestBody = {
        log: [
          'sample#id=1',
          'sample#service_name=example',
          'unexpected#key=value',
        ],
      };

      await logService.parseLogAndWriteToFile(logRequestBody);

      expect(writeLogToFile).toHaveBeenCalledTimes(1);
      expect(writeLogToFile).toHaveBeenCalledWith({
        id: '1',
        service_name: 'example',
        process: '',
        load_avg_1m: '',
        load_avg_5m: '',
        load_avg_15m: '',
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Unexpected log item: unexpected#key=value',
      );

      consoleSpy.mockRestore();
    });
  });
});
