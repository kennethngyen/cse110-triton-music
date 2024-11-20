module.exports = {
    preset: "ts-jest", // ts-jest is used for transforming TypeScript files
    transform: {
        "^.+\\.ts$": ["ts-jest", {tsconfig: "tsconfig.json"}], // Transform TypeScript files using ts-jest
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
