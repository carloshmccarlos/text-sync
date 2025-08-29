import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { db } from "~/lib/db";
import { rooms } from "~/lib/db/schema/schema";
import { RoomCreateSchema, RoomUpdateSchema } from "~/validation/schema";

// List all rooms
export const listRooms = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(rooms);
});

// Get one room by id
export const getRoom = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const validatedData = v.parse(v.object({ id: v.string() }), data);
    const [row] = await db.select().from(rooms).where(eq(rooms.id, validatedData.id));
    return row ?? null;
  },
);

// Create a room
export const createRoom = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const validatedData = v.parse(RoomCreateSchema, data);
    const [created] = await db
      .insert(rooms)
      .values({ name: validatedData.name })
      .returning();
    return created;
  },
);

// Update a room
export const updateRoom = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const validatedData = v.parse(RoomUpdateSchema, data);
    const updateValues: Partial<typeof rooms["$inferInsert"]> = {};
    if (typeof validatedData.name === "string") updateValues.name = validatedData.name;

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

// Delete a room by id
export const deleteRoom = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const validatedData = v.parse(v.object({ id: v.string() }), data);
    const [deleted] = await db.delete(rooms).where(eq(rooms.id, validatedData.id)).returning();
    return deleted ?? null;
  },
);
