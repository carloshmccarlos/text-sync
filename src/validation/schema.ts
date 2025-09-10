import * as v from "valibot";

// Message schemas
export const MessageCreateSchema = v.object({
	id: v.optional(v.string()),
	roomId: v.pipe(v.string(), v.nonEmpty("Room ID is required")),
	title: v.optional(v.pipe(v.string(), v.maxLength(255))),
	content: v.optional(v.string()),
});

export const MessageUpdateSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty("Message ID is required")),
	title: v.optional(v.pipe(v.string(), v.maxLength(255))),
	content: v.optional(v.string()),
});

export const MessageCollectionSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty("Message ID is required")),
	room_id: v.pipe(v.string(), v.nonEmpty("Room ID is required")),
	title: v.optional(v.pipe(v.string(), v.maxLength(255))),
	content: v.optional(v.string()),
});

// Room schemas
export const RoomCreateSchema = v.object({
	name: v.pipe(
		v.string(),
		v.nonEmpty("Room name is required"),
		v.maxLength(255, "Room name must be less than 255 characters"),
		v.trim(),
	),
});

export const RoomUpdateSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty("Room ID is required")),
	name: v.optional(
		v.pipe(
			v.string(),
			v.nonEmpty("Room name cannot be empty"),
			v.maxLength(255, "Room name must be less than 255 characters"),
			v.trim(),
		),
	),
});

export const RoomCollectionSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty("Room ID is required")),
	name: v.pipe(
		v.string(),
		v.nonEmpty("Room name is required"),
		v.maxLength(255, "Room name must be less than 255 characters"),
	),
	createdAt: v.date(),
	updatedAt: v.date(),
});

// Join room schema
export const JoinRoomSchema = v.object({
	code: v.pipe(
		v.string(),
		v.nonEmpty("Room code is required"),
		v.length(6, "Room code must be exactly 6 characters"),
		v.regex(
			/^[A-Z0-9]+$/,
			"Room code must contain only uppercase letters and numbers",
		),
	),
});
