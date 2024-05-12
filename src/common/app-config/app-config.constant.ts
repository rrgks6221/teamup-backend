const APP = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  APP_STAGE: 'APP_STAGE',
} as const;

const DATABASE = {
  DATABASE_URL: 'DATABASE_URL',
} as const;

export const ENV_KEY = {
  ...APP,
  ...DATABASE,
} as const;
