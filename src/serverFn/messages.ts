import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { supabase } from "~/lib/db";
import { MessageCreateSchema, MessageUpdateSchema } from "~/validation/schema";

// List all messages
export const listMessages = createServerFn({ method: "GET" }).handler(
	async () => {
		const { data, error } = await supabase.from("messages").select("*");

		if (error) throw error;
		return data || [];
	},
);

// Get messages by room id
export const getMessagesByRoom = createServerFn({ method: "POST" })
	.validator(v.string())
	.handler(async ({ data }) => {
		const { data: messagesList, error } = await supabase
			.from("messages")
			.select("*")
			.eq("room_id", data);

		if (error) throw error;
		return messagesList || [];
	});

// Get one message by id
export const getMessage = createServerFn({ method: "POST" })
	.validator(v.object({ id: v.string() }))
	.handler(async ({ data }) => {
		const { id } = data;

		const { data: message, error } = await supabase
			.from("messages")
			.select("*")
			.eq("id", id)
			.single();

		if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
		return message ?? null;
	});

// Create a message
export const createMessage = createServerFn({ method: "POST" })
	.validator(MessageCreateSchema)
	.handler(async ({ data }) => {
		// Ensure all values are properly typed for Supabase
		const insertData = {
			id: data.id || undefined,
			room_id: data.roomId,
			title: data.title || null,
			content: "",
		};

		const { data: message, error } = await supabase
			.from("messages")
			.insert(insertData)
			.select("*")
			.single();

		if (error) throw error;
		
		// Generate a txid based on timestamp for synchronization
		const txid = Date.now().toString();
		
		return { data: message, txid };
	});

// Update a message
export const updateMessage = createServerFn({ method: "POST" })
	.validator(MessageUpdateSchema)
	.handler(async ({ data }) => {
		const { id, content, title } = data;

		const updateValues: any = {};
		if (typeof content !== "undefined") updateValues.content = content;
		if (typeof title !== "undefined") updateValues.title = title;

		if (Object.keys(updateValues).length === 0) {
			throw new Error("No fields provided to update");
		}

		const { data: updated, error } = await supabase
			.from("messages")
			.update(updateValues)
			.eq("id", id)
			.select("*")
			.single();

		if (error) {
			throw error;
		}
		
		// Generate a txid based on timestamp for synchronization
		const txid = Date.now().toString();
		
		return { data: updated ?? null, txid };
	});




export const deleteMessage = createServerFn({ method: "POST" })
	.validator(v.object({ id: v.string() }))
	.handler(async ({ data }) => {
		const { id } = data;
		const { data: deleted, error } = await supabase
			.from("messages")
			.delete()
			.eq("id", id)
			.select("*")
			.single();

		if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
		return deleted ?? null;
	});
