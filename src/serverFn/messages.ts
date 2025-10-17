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
  }
);

// Get messages by room id
export const getMessagesByRoom = createServerFn({ method: "POST" })
  .inputValidator(v.string())
  .handler(async (ctx) => {
    const { data: messagesList, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", ctx.data);

    if (error) throw error;
    return messagesList || [];
  });

// Get one message by id
export const getMessage = createServerFn({ method: "POST" })
  .inputValidator(v.object({ id: v.string() }))
  .handler(async (ctx) => {
    const { id } = ctx.data;

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
  .inputValidator(MessageCreateSchema)
  .handler(async (ctx) => {
    // Ensure all values are properly typed for Supabase
    const insertData = {
      id: ctx.data.id || undefined,
      room_id: ctx.data.roomId,
      title: ctx.data.title || null,
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
  .inputValidator(MessageUpdateSchema)
  .handler(async (ctx) => {
    const { id, content, title } = ctx.data;

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
  .inputValidator(v.object({ id: v.string() }))
  .handler(async (ctx) => {
    const { id } = ctx.data;
    const { data: deleted, error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
    const txid = Date.now().toString();

    return { data: deleted ?? null, txid };
  });
