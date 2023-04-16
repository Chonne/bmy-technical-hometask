import { sendToList as sendToRedisList } from '../lib/redis';
import { compute } from '../lib/slowComputation';

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
        slow_computation: '',
      } as LogObject,
    );
  }

  async parseLogAndSendLogToRedis(
    logRequestBody: LogRequestBody,
  ): Promise<void> {
    let logObject = this.parseLog(logRequestBody.log);

    logObject = await compute(logObject);

    await sendToRedisList(logObject);
  }
}
