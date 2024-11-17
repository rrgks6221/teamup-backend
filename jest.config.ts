/* eslint-disable */
export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/$1',
    '^@module/(.*)$': '<rootDir>/modules/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@core/(.*)$': '<rootDir>/core/$1',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  displayName: 'teamup-backend',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: '<rootDir>/../tsconfig.spec.json' },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/../test/after-env-setup.ts'],
  globalSetup: '<rootDir>/../test/global-setup.ts',
  globalTeardown: '<rootDir>/../test/global-teardown.ts',
};
