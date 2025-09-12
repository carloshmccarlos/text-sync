import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env/server";

// Use postgres-js driver optimized for Cloudflare Workers + Supabase
// This configuration is optimized for serverless environments
const client = postgres(env.DATABASE_URL, {
	prepare: false, // Required for Cloudflare Workers compatibility
	max: 1, // Single connection for serverless environment
	idle_timeout: 20, // Close idle connections after 20 seconds
	connect_timeout: 10, // Connection timeout in seconds
	ssl: env.NODE_ENV === "production" ? "require" : "prefer", // SSL configuration
});

export const db = drizzle(client);
