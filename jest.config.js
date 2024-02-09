/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  setupFiles: ['<rootDir>/test/setEnvVars.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
};
