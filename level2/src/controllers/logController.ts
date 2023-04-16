import LogService from '../services/LogService';
import { Request, Response } from 'express';

export const sendParsedLogToRedis = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const logService = new LogService();

  try {
    // The process can take a long time, so we don't want to wait for it to
    // finish before sending a response to the client. This doesn't allow us to
    // return errors to the client, but we're assuming it's not what's expected
    logService.parseLogAndSendLogToRedis(req.body);

    res.sendStatus(202);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
