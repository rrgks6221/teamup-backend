const APP = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  APP_STAGE: 'APP_STAGE',
} as const;

const DATABASE = {
  DATABASE_URL: 'DATABASE_URL',
} as const;

const JWT = {
  JWT_ACCESS_TOKEN_EXPIRES_IN: 'JWT_ACCESS_TOKEN_EXPIRES_IN',
  JWT_REFRESH_TOKEN_EXPIRES_IN: 'JWT_REFRESH_TOKEN_EXPIRES_IN',
} as const;

export const ENV_KEY = {
  ...APP,
  ...DATABASE,
  ...JWT,
} as const;
