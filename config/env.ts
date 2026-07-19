import dotenv from 'dotenv';

dotenv.config({ override: true });

const requiredEnvironmentVariables = ['BASE_URL', 'USERNAME', 'PASSWORD'] as const;
const DEFAULT_TIMEOUT = 30000;

type EnvironmentVariableName = (typeof requiredEnvironmentVariables)[number];

type EnvironmentConfig = Record<EnvironmentVariableName, string>;

const getRequiredEnvironmentVariable = (name: EnvironmentVariableName): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const env: EnvironmentConfig = {
  BASE_URL: getRequiredEnvironmentVariable('BASE_URL'),
  USERNAME: getRequiredEnvironmentVariable('USERNAME'),
  PASSWORD: getRequiredEnvironmentVariable('PASSWORD')
};

export const globalTimeout = Number(
  process.env.GLOBAL_TIMEOUT ?? DEFAULT_TIMEOUT
);
