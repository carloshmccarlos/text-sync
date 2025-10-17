import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
  createMessage,
  deleteMessage,
  updateMessage,
} from "~/serverFn/messages";
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
            : `http://localhost:3000`
        ).toString(),
        // Pass roomId so the server can scope the shape with a WHERE clause
        params: { roomId },
      },
      getKey: (item) => item.id,
      onUpdate: async ({ transaction }) => {
        try {
          const { modified } = transaction.mutations[0];

          const updateData = {
            id: modified.id,
            title: modified.title ?? undefined,
            content: modified.content ?? undefined,
          };

          console.log(updateData);
          // Persist the change to Postgres via your serverFn and use its txid
          const result = await updateMessage({ data: updateData });
          const txid = result?.txid ? Number(result.txid) : 0;
          return { txid };
        } catch (error) {
          console.error("Failed to update message in collection:", error);
          // Return a default txid to prevent collection errors
          return { txid: Date.now() };
        }
      },

      onInsert: async ({ transaction }) => {
        try {
          const { modified } = transaction.mutations[0];

          const createData = {
            id: modified.id,
            roomId: modified.room_id,
            title: modified.title ?? undefined,
            content: modified.content ?? undefined,
          };

          const result = await createMessage({ data: createData });

          const txid = result?.txid ? Number(result.txid) : 0;
          return { txid };
        } catch (error) {
          console.error("Failed to create message in collection:", error);
          // Return a default txid to prevent collection errors
          return { txid: Date.now() };
        }
      },

      onDelete: async ({ transaction }) => {
        try {
          const { modified } = transaction.mutations[0];

          const deleteData = {
            id: modified.id,
          };

          const result = await deleteMessage({ data: deleteData });

          const txid = result?.txid ? Number(result.txid) : 0;
          return { txid, result };
        } catch (error) {
          console.error("Failed to delete message in collection:", error);
          // Return a default txid to prevent collection errors
          return { txid: Date.now(), result: null };
        }
      },
    })
  );
};
