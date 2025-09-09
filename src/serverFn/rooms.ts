import { createServerFn } from "@tanstack/react-start";
import { eq, lt } from "drizzle-orm";
import * as v from "valibot";
import { db } from "~/lib/db";
import { rooms, messages } from "~/lib/db/schema/schema";
import { RoomCreateSchema, RoomUpdateSchema } from "~/validation/schema";

// List all rooms
export const listRooms = createServerFn({ method: "GET" }).handler(async () => {
	return db.select().from(rooms);
});

// Get one room by id
export const getRoom = createServerFn({ method: "POST" })
	.validator(v.object({ id: v.string() }))
	.handler(async ({ data }) => {
		const [row] = await db.select().from(rooms).where(eq(rooms.id, data.id));
		return row ?? null;
	});

// Create a room
export const createRoom = createServerFn({ method: "POST" })
	.validator(RoomCreateSchema)
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
				const [created] = await db
					.insert(rooms)
					.values({ id, name: data.name })
					.returning();
				return created;
			} catch (error) {
				// If it's a unique constraint violation, try again with a new ID
				if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
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
export const updateRoom = createServerFn({ method: "POST" }).handler(
	async (data: unknown) => {
		const validatedData = v.parse(RoomUpdateSchema, data);
		const updateValues: Partial<(typeof rooms)["$inferInsert"]> = {};
		if (typeof validatedData.name === "string")
			updateValues.name = validatedData.name;

		if (Object.keys(updateValues).length === 0) {
			throw new Error("No fields provided to update");
		}

		const [updated] = await db
			.update(rooms)
			.set(updateValues)
			.where(eq(rooms.id, validatedData.id))
			.returning();

		return updated ?? null;
	},
);

// Update room timestamp
export const updateRoomTimestamp = createServerFn({ method: "POST" })
	.validator(v.object({ id: v.string() }))
	.handler(async ({ data }) => {
		const [updated] = await db
			.update(rooms)
			.set({ updatedAt: new Date() })
			.where(eq(rooms.id, data.id))
			.returning();
		return updated ?? null;
	});

// Delete a room by id
export const deleteRoom = createServerFn({ method: "POST" })
	.validator(v.object({ id: v.string() }))
	.handler(async ({ data }) => {
		const [deleted] = await db
			.delete(rooms)
			.where(eq(rooms.id, data.id))
			.returning();
		return deleted ?? null;
	});

// Delete rooms older than 24 hours
export const deleteExpiredRooms = createServerFn({ method: "POST" })
	.handler(async () => {
		const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
		
		// First, get the rooms that will be deleted for logging
		const expiredRooms = await db
			.select({ id: rooms.id, name: rooms.name, createdAt: rooms.createdAt })
			.from(rooms)
			.where(lt(rooms.createdAt, twentyFourHoursAgo));
		
		if (expiredRooms.length === 0) {
			console.log('No expired rooms found');
			return { deletedCount: 0, deletedRooms: [] };
		}
		
		// Delete the expired rooms (messages will be deleted automatically due to cascade)
		const deletedRooms = await db
			.delete(rooms)
			.where(lt(rooms.createdAt, twentyFourHoursAgo))
			.returning();
		
		console.log(`Deleted ${deletedRooms.length} expired rooms:`, deletedRooms.map(r => ({ id: r.id, name: r.name })));
		
		return {
			deletedCount: deletedRooms.length,
			deletedRooms: deletedRooms.map(r => ({ id: r.id, name: r.name, createdAt: r.createdAt }))
		};
	});
