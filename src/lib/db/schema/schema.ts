// export your other schemas here

import { relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

// --------------------- ROOMS ---------------------
export const rooms = pgTable("rooms", {
	// Use a short 6-character room ID
	id: varchar("id", { length: 6 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --------------------- MESSAGES ---------------------
export const messages = pgTable("messages", {
	id: uuid("id").defaultRandom().primaryKey(),
	roomId: varchar("room_id", { length: 6 })
		.notNull()
		.references(() => rooms.id, { onDelete: "cascade" }),
	title: text("title"),
	content: text("content"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const totalCounts = pgTable("total_count", {
	id: varchar("id", { length: 6 }).primaryKey(),
	roomCount: integer("room_count").notNull(),
	messageCount: integer("message_count").notNull(),
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
