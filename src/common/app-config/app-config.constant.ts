const APP = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  APP_STAGE: 'APP_STAGE',
} as const;

export const ENV_KEY = {
  ...APP,
} as const;
