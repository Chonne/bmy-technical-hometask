import _ from "lodash";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import { sample } from "./logGenerator";

const ENDPOINT = "http://127.0.0.1:3000";

const httpRequest = async () => {
  try {
    const response = await axios.post(
      ENDPOINT,
      { log: sample(uuidv4()) },
      { timeout: 500 }
    );
    console.log(response);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.code === "ECONNABORTED") {
        console.log(`Remote server timed-out on ${ENDPOINT}`);
        return "timeout";
      } else {
        console.log(`Connection refused on ${ENDPOINT}`);
        return "error";
      }
    }
  }
};

_.times(500, httpRequest);
