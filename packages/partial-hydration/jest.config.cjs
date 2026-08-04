module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/../../jest.setup.cjs'],
  transform: {
    '^.+\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
};
