import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { MessagesList } from "~/components/MessagesList";
import { RoomExpiredError } from "~/components/RoomExpiredError";
import { SessionInfoCard } from "~/components/SessionInfoCard";
import { TextSyncArea } from "~/components/TextSyncArea";
import { Button } from "~/components/ui/button";
import { createMessagesCollection } from "~/lib/collection/messageCollection";
import {
	createMessage,
	getMessagesByRoom,
	updateMessage,
} from "~/serverFn/messages";
import { deleteRoom, getRoom } from "~/serverFn/rooms";

export const Route = createFileRoute("/text-sync/$id")({
	loader: async ({ params }) => {
		const roomId = params.id;

		// Validate room exists
		const room = await getRoom({ data: { id: roomId } });
		const messages = await getMessagesByRoom({ data: room.id });

		if (!room) {
			throw redirect({ to: "/" });
		}

		// Check if room is older than 24 hours
		const now = new Date();
		const roomCreatedAt = new Date(room.createdAt);
		const hoursDiff =
			(now.getTime() - roomCreatedAt.getTime()) / (1000 * 60 * 60);

		if (hoursDiff > 24) {
			// Room is expired, return special flag
			return {
				room,
				messages: [],
				isExpired: true,
			};
		}

		return {
			room,
			initMessageId: messages?.[0]?.id,
			isExpired: false,
		};
	},
	ssr: false,

	component: TextSyncPage,
});

function TextSyncPage() {
	const { room, isExpired, initMessageId } = Route.useLoaderData();

	const [isDeleting, setIsDeleting] = useState(false);
	const [isCreatingMessage, setIsCreatingMessage] = useState(false);

	const [selectedMessageId, setSelectedMessageId] = useState<
		string | undefined
	>(initMessageId);

	const messagesCollection = createMessagesCollection(room.id);

	if (isExpired) {
		return <RoomExpiredError roomId={room.id} />;
	}

	const handleCreateMessage = async () => {
		setIsCreatingMessage(true);
		try {
			const newMessage = await createMessage({
				data: {
					roomId: room.id,
					title: "New Message",
					content: "",
				},
			});

			if (newMessage) {
				// Automatically select the new message for editing
				setSelectedMessageId(newMessage.id);
			}
		} catch (error) {
			console.error("Failed to create message:", error);
			alert("Failed to create message. Please try again.");
		} finally {
			setIsCreatingMessage(false);
		}
	};

	const handleRenameMessage = async (messageId: string, newTitle: string) => {
		if (!messagesCollection) {
			console.error("Messages collection not available");
			return;
		}

		try {
			// Update locally first for immediate feedback
			messagesCollection.update(messageId, (draft) => {
				draft.title = newTitle;
			});

			// Then sync to server
			await updateMessage({
				data: {
					id: messageId,
					title: newTitle,
				},
			});
		} catch (error) {
			console.error("Failed to rename message:", error);
			alert("Failed to rename message. Please try again.");
		}
	};

	const handleDeleteRoom = async () => {
		if (
			!confirm(
				`Are you sure you want to delete room "${room.name}"? This action cannot be undone.`,
			)
		) {
			return;
		}

		setIsDeleting(true);
		try {
			await deleteRoom({ data: { id: room.id } });
			// Redirect to home after successful deletion
			window.location.href = "/";
		} catch (error) {
			console.error("Failed to delete room:", error);
			alert("Failed to delete room. Please try again.");
			setIsDeleting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
			<div className="max-w-7xl mx-auto p-6 pt-20 space-y-6">
				{/* Info Card at the top */}
				<SessionInfoCard roomId={room.id} />

				{/* Main content area - left and right layout */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
					{/* Messages List - Left side */}
					<div className="lg:col-span-1">
						<MessagesList
							messagesCollection={messagesCollection}
							selectedMessageId={selectedMessageId}
							onSelectMessage={setSelectedMessageId}
							onCreateMessage={handleCreateMessage}
							onRenameMessage={handleRenameMessage}
							isCreatingMessage={isCreatingMessage}
						/>
					</div>

					{/* Text Sync Area - Right side */}
					<div className="lg:col-span-2">
						<TextSyncArea
							messagesCollection={messagesCollection}
							selectedMessageId={selectedMessageId}
						/>
					</div>
				</div>

				{/* Delete Room Button */}
				<div className="flex justify-end">
					<Button
						type={"button"}
						onClick={handleDeleteRoom}
						disabled={isDeleting}
						className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
					>
						{isDeleting ? (
							<>
								{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="animate-spin h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Deleting...
							</>
						) : (
							<>
								{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Delete Room
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
