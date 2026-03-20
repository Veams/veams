module.exports = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [], // allow node_modules to be transformed
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
    '^.+\\.mjs$': '@swc/jest',
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.mjs$': '$1',
  },
  verbose: false, // omit test noise
  passWithNoTests: true, // Not in the Jest documentation, but it's supported (https://github.com/jestjs/jest/issues/8896#issuecomment-1443795069).
  clearMocks: true,
  coverageDirectory: './coverage/',
  coverageReporters: ['json-summary', ['text', { skipFull: true }], 'lcov'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  reporters: ['default'],
  moduleFileExtensions: ['mjs', 'js', 'ts', 'jsx', 'tsx'],
  testEnvironment: 'jsdom',
};
