// export default {
//   transform: {},
//   setupFiles: ["esm"],
//   extensionsToTreatAsEsm: [".js"],
// };

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.js$",
  collectCoverageFrom: ["src/**/*.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
