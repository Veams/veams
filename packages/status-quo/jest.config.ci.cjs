const defaultConfig = require('./jest.config.cjs');
const ciConfig = require('@spring-media/1up-bff-common-configs/jest/jest.config.ci');

module.exports = {
  ...defaultConfig,
  ...ciConfig,
};
