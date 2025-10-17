import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { supabase } from "~/lib/db";
import { RoomCreateSchema, RoomUpdateSchema } from "~/validation/schema";

// List all rooms
export const listRooms = createServerFn({ method: "GET" }).handler(async () => {
	const { data, error } = await supabase.from("rooms").select("*");

	if (error) throw error;
	return data || [];
});

// Get one room by id
export const getRoom = createServerFn({ method: "POST" })
	.inputValidator(v.object({ id: v.string() }))
	.handler(async ({ data }) => {
		// Get room with messages using Supabase's foreign key relationships
		const { data: room, error } = await supabase
			.from("rooms")
			.select(`
				*,
				messages(*)
			`)
			.eq("id", data.id)
			.single();

		if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"

		return { room, messages: room.messages };
	});

// Create a room
export const createRoom = createServerFn({ method: "POST" })
	.inputValidator(RoomCreateSchema)
	.handler(async ({ data }) => {
		const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		const makeId = () =>
			Array.from(
				{ length: 6 },
				() => alphabet[Math.floor(Math.random() * alphabet.length)],
			).join("");

		let attempts = 0;
		const maxAttempts = 5;

		while (attempts < maxAttempts) {
			const id = makeId();
			try {
				const { data: created, error } = await supabase
					.from("rooms")
					.insert({ id, name: data.name })
					.select("*")
					.single();

				if (error) throw error;
				return created;
			} catch (error: any) {
				// If it's a unique constraint violation, try again with a new ID
				if (
					error?.code === "23505" || // PostgreSQL unique violation
					error?.message?.includes("duplicate key") ||
					error?.message?.includes("UNIQUE constraint failed")
				) {
					attempts++;
					continue;
				}
				// For other errors, rethrow
				throw error;
			}
		}

		// If we've exhausted all attempts, throw an error
		throw new Error(`Failed to create room after ${maxAttempts} attempts`);
	});

// Update a room
export const updateRoom = createServerFn({ method: "POST" })
	.inputValidator(RoomUpdateSchema)
	.handler(async ({ data }) => {
		const updateValues: any = {};
		if (typeof data.name === "string")
			updateValues.name = data.name;

		if (Object.keys(updateValues).length === 0) {
			throw new Error("No fields provided to update");
		}

		const { data: updated, error } = await supabase
			.from("rooms")
			.update(updateValues)
			.eq("id", data.id)
			.select("*")
			.single();

		if (error) throw error;
		return updated ?? null;
	});

// Update room timestamp
export const updateRoomTimestamp = createServerFn({ method: "POST" })
	.inputValidator(v.object({ id: v.string() }))
	.handler(async ({ data }) => {
		const { data: updated, error } = await supabase
			.from("rooms")
			.update({ updated_at: new Date().toISOString() })
			.eq("id", data.id)
			.select("*")
			.single();

		if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
		return updated ?? null;
	});

// Delete a room by id
export const deleteRoom = createServerFn({ method: "POST" })
	.inputValidator(v.object({ id: v.string() }))
	.handler(async ({ data }) => {
		const { data: deleted, error } = await supabase
			.from("rooms")
			.delete()
			.eq("id", data.id)
			.select("*")
			.single();

		if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
		return deleted ?? null;
	});

// Delete rooms older than 24 hours
export const deleteExpiredRooms = createServerFn({ method: "POST" }).handler(
	async () => {
		const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

		// First, get the rooms that will be deleted for logging
		const { data: expiredRooms, error: selectError } = await supabase
			.from("rooms")
			.select("id, name, created_at")
			.lt("created_at", twentyFourHoursAgo.toISOString());

		if (selectError) throw selectError;

		if (!expiredRooms || expiredRooms.length === 0) {
			console.log("No expired rooms found");
			return { deletedCount: 0, deletedRooms: [] };
		}

		// Delete the expired rooms (messages will be deleted automatically due to cascade)
		const { data: deletedRooms, error: deleteError } = await supabase
			.from("rooms")
			.delete()
			.lt("created_at", twentyFourHoursAgo.toISOString())
			.select("*");

		if (deleteError) throw deleteError;

		console.log(
			`Deleted ${deletedRooms?.length || 0} expired rooms:`,
			deletedRooms?.map((r: any) => ({ id: r.id, name: r.name })) || [],
		);

		return {
			deletedCount: deletedRooms?.length || 0,
			deletedRooms:
				deletedRooms?.map((r: any) => ({
					id: r.id,
					name: r.name,
					createdAt: r.created_at,
				})) || [],
		};
	},
);
