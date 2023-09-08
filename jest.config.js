module.exports = {
    preset: 'ts-jest',
    modulePaths: ['<rootDir>'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['build'],
    modulePathIgnorePatterns: ['<rootDir>/build'],
    testEnvironmentOptions: {
        NODE_ENV: 'test',
        APP_ENV: 'test',
    },
    restoreMocks: true,
    coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.ts', 'tests', 'src/controllers/app-logs'],
    coverageReporters: ['text', 'lcov', 'clover', 'html'],
    transform: {
        '^.+\\.test.ts?$': 'ts-jest',
    },
    moduleNameMapper: {
        '@/(.*)$': '<rootDir>/src/$1',
        '@@/(.*)$': '<rootDir>/$1',
    },
    setupFiles: ['dotenv/config'],
};

// '<rootDir>/src/tests/integration',
