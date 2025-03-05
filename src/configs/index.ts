/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ms from "ms";
import dotenv from "dotenv";
import packageInfo from "../../package.json";

dotenv.config();

const APP_VERSION = packageInfo.version;
const DEPLOYMENT_ENV = process.env.NODE_ENV || "development";

const GLOBAL_CONSTANTS = {
    // System Constants
    // ============================================================
    APP_NAME: "mbl-api",

    // Security / Auth Configs
    // ============================================================
    BCRYPT_SALT: 10,
    ACCESS_TOKEN_JWT_EXPIRES_IN: ms("90d"),
    REFRESH_TOKEN_JWT_EXPIRES_IN: ms("90d"),
    DEFAULT_DB_TOKEN_EXPIRY_DURATION: ms("15m"),

    // App Level Configs
    // ============================================================
    APP_ROLES: {
        USER: ["user"],
    },
};

const CONFIG_BUILDER = {
    development: {
        ...GLOBAL_CONSTANTS,

        // System Constants
        // ============================================================
        URL: {
            API_BASE_URL: "https://localhost:4000",
            AUTH_BASE_URL: "https://localhost:3000",
            LANDING_BASE_URL: "https://localhost:3000",
        },

        // Security / Auth Configs
        // ============================================================
        JWT_SECRET: "T4u2Rcnne09F.FBr11f0VvERyUiq",

        // DB Constants
        // ============================================================
        MONGODB_URI: process.env.MONGO_ATLAS_URI!,
        // MONGODB_URI: "mongodb://127.0.0.1:27017/mbl-api",
    },

    production: {
        ...GLOBAL_CONSTANTS,

        // System Constants
        // ============================================================
        URL: {
            AUTH_BASE_URL: "https://mbl-api.com",
            LANDING_BASE_URL: "https://mbl-api.com",
            API_BASE_URL: "https://api.mbl-api.com",
        },

        // Security / Auth Configs
        // ============================================================
        JWT_SECRET: process.env.JWT_SECRET!,

        // DB Constants
        // ============================================================
        MONGODB_URI: process.env.MONGO_ATLAS_URI!,
    },
} as const;

// Check if DEPLOYMENT_ENV is valid
if (!Object.keys(CONFIG_BUILDER).includes(DEPLOYMENT_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${DEPLOYMENT_ENV}`);
}

const CONFIGS = CONFIG_BUILDER[DEPLOYMENT_ENV as keyof typeof CONFIG_BUILDER];

// Uncomment below to check configs set
// console.log("CONFIGS:", CONFIGS);

export { DEPLOYMENT_ENV, APP_VERSION, CONFIGS };
