import type { messages, rooms } from "~/lib/db/schema/schema";

export type RoomsInsert = typeof rooms.$inferInsert;
export type RoomsSelect = typeof rooms.$inferSelect;

export type MessagesSelect = typeof messages.$inferSelect;
export type MessagesInsert = typeof messages.$inferInsert;
