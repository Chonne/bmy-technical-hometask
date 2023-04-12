import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { sample } from "./lib/logGenerator.js";

fs.mkdirSync("logs", { recursive: true });

const generateFile = () => {
  const id = uuidv4();
  const filename = `./logs/${id}.txt`;

  fs.writeFileSync(filename, sample(id).join(' '), { encoding: "utf-8"});
};

_.times(1000, generateFile);

console.log("Generated 1000 files in ./logs");
