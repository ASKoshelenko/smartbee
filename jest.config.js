module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)"
    ]
  };