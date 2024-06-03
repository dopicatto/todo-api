module.exports = {
  verbose: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {},
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
