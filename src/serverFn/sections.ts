import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { db } from "~/lib/db";
import { messages } from "~/lib/db/schema/schema";

// Note: This file is kept for compatibility but sections have been simplified
// The current schema only has rooms and messages directly

// List all messages (replacing sections functionality)
export const listMessages = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(messages);
});

// Get messages by room id
export const getMessagesByRoom = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const validatedData = v.parse(v.object({ roomId: v.string() }), data);
    const messagesList = await db
      .select()
      .from(messages)
      .where(eq(messages.roomId, validatedData.roomId));
    return messagesList || [];
  },
);
