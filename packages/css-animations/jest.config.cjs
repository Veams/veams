module.exports = {
  passWithNoTests: true,
  clearMocks: true,
  coverageDirectory: './coverage/',
  coverageReporters: ['json-summary', ['text', { skipFull: true }], 'lcov'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  reporters: ['default'],
  moduleFileExtensions: ['mjs', 'js', 'ts', 'jsx', 'tsx'],
  testEnvironment: 'jsdom',
};
