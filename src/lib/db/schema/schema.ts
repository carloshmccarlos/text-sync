export * from "./auth.schema";

// export your other schemas here

import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// --------------------- ROOMS ---------------------
export const rooms = pgTable("rooms", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
});

// --------------------- MESSAGES ---------------------
export const messages = pgTable("messages", {
	id: uuid("id").defaultRandom().primaryKey(),
	roomId: uuid("room_id")
		.notNull()
		.references(() => rooms.id, { onDelete: "cascade" }),
	title: text("title"),
	content: text("content"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --------------------- RELATIONS ---------------------
export const roomsRelations = relations(rooms, ({ many }) => ({
	messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
	room: one(rooms, {
		fields: [messages.roomId],
		references: [rooms.id],
	}),
}));
