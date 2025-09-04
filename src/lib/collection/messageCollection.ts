import { createCollection } from "@tanstack/db";
import { QueryClient } from "@tanstack/query-core";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { getMessagesByRoom, updateMessage } from "~/serverFn/messages";

const queryClient = new QueryClient();

export const createMessagesCollection = (roomId: string) => {
	return createCollection(
		queryCollectionOptions({
			queryClient,
			queryKey: ["messagesCollection", roomId],
			queryFn: () => getMessagesByRoom({ data: roomId }),
			getKey: (item) => item.id,

			onUpdate: async ({ transaction }) => {
				const { modified } = transaction.mutations[0];

				const updateData = {
					id: modified.id,
					title: modified.title || undefined,
					content: modified.content || undefined,
				};

				await updateMessage({ data: updateData });
			},
		}),
	);
};
