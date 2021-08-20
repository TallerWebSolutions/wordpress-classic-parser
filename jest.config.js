/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  testMatch: ["<rootDir>/test/**/*.test.{js,ts,tsx}"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleDirectories: ["node_modules", "src"],
  coverageDirectory: "coverage-jest",
  collectCoverageFrom: ["src/**/*.{js,ts,tsx}"],
  preset: "ts-jest",
};

module.exports = config;
