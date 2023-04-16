import fs from 'fs';

let PARSED_DIR: string;

export const initConfig = (parsedDirPath: string) => {
  PARSED_DIR = parsedDirPath;
};

export const createDirIfNotExists = async (dir: string): Promise<void> => {
  try {
    // Check if the directory exists
    await fs.promises.access(dir);
  } catch {
    // If it doesn't exist, create it
    await fs.promises.mkdir(dir);
  }
};

export const writeLogToFile = async (logObject: LogObject): Promise<void> => {
  const { id } = logObject;

  if (fs.existsSync(`${PARSED_DIR}/#${id}.json`)) {
    throw new Error(`File ${PARSED_DIR}/#${id}.json already exists`);
  }

  return fs.promises.writeFile(
    `${PARSED_DIR}/#${id}.json`,
    JSON.stringify(logObject),
  );
};
