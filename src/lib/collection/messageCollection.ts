import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { updateMessage } from "~/serverFn/messages";
import { MessageCollectionSchema } from "~/validation/schema";

export const createMessagesCollection = (roomId: string) => {
	return createCollection(
		electricCollectionOptions({
			id: "messages",
			schema: MessageCollectionSchema,
			shapeOptions: {
				// Proxied Electric shape endpoint (see /src/routes/api/messages.ts)
				url: new URL(
					`/api/messages`,
					typeof window !== `undefined`
						? window.location.origin
						: `http://localhost:3000`,
				).toString(),
				// Pass roomId so the server can scope the shape with a WHERE clause
				params: { roomId },
			},
			getKey: (item) => item.id,
			onUpdate: async ({ transaction }) => {
				const { modified } = transaction.mutations[0];

				const updateData = {
					id: modified.id,
					title: modified.title ?? undefined,
					content: modified.content ?? undefined,
				};
				// Persist the change to Postgres via your serverFn and use its txid
				const result = await updateMessage({ data: updateData });
				const txid =
					result && (result as any).txid ? Number((result as any).txid) : 0;
				return { txid };
			},
		}),
	);
};
