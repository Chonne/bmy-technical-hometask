import express from 'express';
import { storeParsedLog } from './controllers/logController';
import { createDirIfNotExists, initConfig as initConfigForFs } from './lib/fs';

const app = express();
const port = 3000;
const parsedDirPath = process.env.PARSED_DIR_PATH || `${process.cwd()}/parsed`;

app.use(express.json());

initConfigForFs(parsedDirPath);

app.post('/', storeParsedLog);

app.listen(port, async () => {
  await createDirIfNotExists(parsedDirPath);
  console.log(`Server is listening on ${port}`);
});
