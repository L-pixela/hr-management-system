module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!**/node_modules/**',
  ],
  testMatch: [
    '**/test/**/*.test.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  verbose: true,
};
