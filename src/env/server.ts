import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		DATABASE_URL: z.url(),
		VITE_BASE_URL: z.url().default("http://localhost:3000"),
		BETTER_AUTH_SECRET: z.string().min(1),
		ELECTRIC_SHAPE_URL: z.url(),
		ELECTRIC_SQL_CLOUD_SOURCE_ID: z.string().min(1),
		ELECTRIC_SQL_CLOUD_SOURCE_SECRET: z.string().min(1),

		SUPABASE_URL: z.string(),
		SUPABASE_KEY: z.string(),

		// OAuth2 providers, optional, update as needed
		GITHUB_CLIENT_ID: z.string().optional(),
		GITHUB_CLIENT_SECRET: z.string().optional(),
		GOOGLE_CLIENT_ID: z.string().optional(),
		GOOGLE_CLIENT_SECRET: z.string().optional(),
	},
	runtimeEnv: process.env,
});
