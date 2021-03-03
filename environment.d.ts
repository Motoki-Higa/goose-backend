import { Context } from "vm";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_CONNECTION: string;
            DB_NAME: string;
            S3_ACCESS_KEY: string;
            S3_ACCESS_SECRET: string;
            S3_BUCKET: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}