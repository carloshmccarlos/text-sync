import { createServerFn } from "@tanstack/react-start";
import { eq, sql } from "drizzle-orm";
import * as v from "valibot";
import { db } from "~/lib/db";
import { messages } from "~/lib/db/schema/schema";
import { MessageCreateSchema, MessageUpdateSchema } from "~/validation/schema";
import type { MessagesInsert } from "~/validation/types";

// List all messages
export const listMessages = createServerFn({ method: "GET" }).handler(
	async () => {
		return db.select().from(messages);
	},
);

// Get messages by room id
export const getMessagesByRoom = createServerFn({ method: "POST" })
	.validator(v.string())
	.handler(async ({ data }) => {
		const messagesList = await db
			.select()
			.from(messages)
			.where(eq(messages.roomId, data));

		return messagesList || [];
	});

// Get one message by id
export const getMessage = createServerFn({ method: "POST" })
	.validator(v.object({ id: v.string() }))
	.handler(async ({ data }) => {
		const { id } = data;

		const [message] = await db
			.select()
			.from(messages)
			.where(eq(messages.id, id));
		return message ?? null;
	});

// Create a message
export const createMessage = createServerFn({ method: "POST" })
	.validator(MessageCreateSchema)
	.handler(async ({ data }) => {
		const [message] = await db
			.insert(messages)
			.values({
				roomId: data.roomId,
				title: "Message",
				content: "",
			})
			.returning();
		return message;
	});

// Update a message
export const updateMessage = createServerFn({ method: "POST" })
	.validator(MessageUpdateSchema)
	.handler(async ({ data }) => {
		const { id, content, title } = data;

		const updateValues: Partial<MessagesInsert> = {};
		if (typeof content !== "undefined") updateValues.content = content;
		if (typeof title !== "undefined") updateValues.title = title;

		if (Object.keys(updateValues).length === 0) {
			throw new Error("No fields provided to update");
		}

		const [updated] = await db
			.update(messages)
			.set(updateValues)
			.where(eq(messages.id, id))
			.returning({
				id: messages.id,
				title: messages.title,
				content: messages.content,
				txid: sql<string>`txid_current()::text`,
			});

		return updated ?? null;
	});

// Delete a message by id
export const deleteMessage = createServerFn({ method: "POST" })
	.validator(v.object({ id: v.string() }))
	.handler(async ({ data }) => {
		const { id } = data;
		const [deleted] = await db
			.delete(messages)
			.where(eq(messages.id, id))
			.returning();
		return deleted ?? null;
	});
