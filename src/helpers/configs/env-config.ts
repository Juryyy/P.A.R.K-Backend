import * as dotenv from 'dotenv';
dotenv.config();
  
class NotEnvVar extends Error {
  constructor(varName: string) {
    super(`Missing required environment variable: ${varName}`);
  }
}

function getEnv<T>(varName: string): T | undefined {
  if (!(varName in process.env)) {
    throw new NotEnvVar(varName);
  }
  return process.env[varName] as T;
}

export default {
  getEnv,
  getEnvOrDefault: <T>(varName: string, defaultValue: T): T => {
    return process.env?.[varName] as T ?? defaultValue;
  }
};