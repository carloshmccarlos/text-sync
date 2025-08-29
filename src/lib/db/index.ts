import { neon } from "@neondatabase/serverless";
import { serverOnly } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "~/env/server";
import * as schema from "~/lib/db/schema/schema";

const driver = neon(env.DATABASE_URL);

const getDatabase = serverOnly(() => drizzle({ client: driver, schema }));

export const db = getDatabase();
