import { defineConfig } from "drizzle-kit"
import "dotenv/config";
// import { config } from "dotenv";

// config({ path: "./" });

export default defineConfig({
    dialect: "turso",
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
        authToken: process.env.DATABASE_AUTH_TOKEN as string
    }
}) 