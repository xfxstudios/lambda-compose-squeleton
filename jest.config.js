/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    coveragePathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/layers/database/node_modules/",
        "<rootDir>/layers/database-layer/node_modules/",
    ],
    transform: {
        '^.+\\.tsx?$': ['ts-jest',{
                babel: true,
                tsConfig: '<rootDir>/services/goid-service/tsconfig.json',
            }
        ]
    },
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/services/**/src/**/*.ts',
        // '<rootDir>/layers/database/**/src/**/*.ts'
    ],
    testMatch: [
        '<rootDir>/test/libs/**/*.test.ts'
    ],
    testPathIgnorePatterns: [
        '<rootDir>/test/stubs/*'
    ],
    forceExit: false,
    resetMocks: true,
};