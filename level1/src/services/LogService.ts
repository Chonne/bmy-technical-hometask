import { writeLogToFile } from '../lib/fs';

export default class LogService {
  private parseLog(log: string[]): LogObject {
    return log.reduce(
      (logObj: LogObject, logItem: string) => {
        // eslint-disable-next-line prefer-const
        let [key, value] = logItem.split('=');
        key = key.replace('sample#', '');

        if (!logObj.hasOwnProperty(key)) {
          console.warn(`Unexpected log item: ${logItem}`);
        } else {
          // doing it this way to avoid TS error 7053. Otherwise would've done:
          // logObj[key] = value;
          return { ...logObj, [key]: value };
        }

        return logObj;
      },
      {
        id: '',
        service_name: '',
        process: '',
        load_avg_1m: '',
        load_avg_5m: '',
        load_avg_15m: '',
      } as LogObject,
    );
  }

  parseLogAndWriteToFile(logRequestBody: LogRequestBody): Promise<void> {
    const logObject = this.parseLog(logRequestBody.log);
    return writeLogToFile(logObject);
  }
}
