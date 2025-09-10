import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "~/components/ConfirmDialog";
import { MessagesList } from "~/components/MessagesList";
import { RoomExpiredError } from "~/components/RoomExpiredError";
import { SessionInfoCard } from "~/components/SessionInfoCard";
import { TextSyncArea } from "~/components/TextSyncArea";
import { Button } from "~/components/ui/button";
import { createMessagesCollection } from "~/lib/collection/messageCollection";

import { deleteRoom, getRoom } from "~/serverFn/rooms";

export const Route = createFileRoute("/text-sync/$id")({
	loader: async ({ params }) => {
		const roomId = params.id;

		// Validate room exists
		const { rooms: room, messages } = await getRoom({ data: { id: roomId } });

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
			initMessageId: messages?.id,
			isExpired: false,
		};
	},
	ssr: false,

	component: TextSyncPage,
});

function TextSyncPage() {
	const { room, isExpired, initMessageId } = Route.useLoaderData();
	const { t } = useTranslation();

	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [selectedMessageId, setSelectedMessageId] = useState<
		string | undefined
	>(initMessageId);

	const messagesCollection = createMessagesCollection(room.id);

	if (isExpired) {
		return <RoomExpiredError roomId={room.id} />;
	}

	const handleDeleteRoom = async () => {
		setIsDeleting(true);
		try {
			await deleteRoom({ data: { id: room.id } });
			// Redirect to home after successful deletion
			window.location.href = "/";
		} catch (error) {
			console.error("Failed to delete room:", error);
			alert(t("session.failedToDelete"));
			setIsDeleting(false);
			setShowDeleteConfirm(false);
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
							roomId={room.id}
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
						onClick={() => setShowDeleteConfirm(true)}
						disabled={isDeleting}
						variant="destructive"
						className="flex items-center gap-2"
					>
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
						{t("session.deleteRoom")}
					</Button>
				</div>

				{/* Delete Confirmation Dialog */}
				<ConfirmDialog
					open={showDeleteConfirm}
					onOpenChange={setShowDeleteConfirm}
					title={t("session.deleteRoomTitle")}
					description={t("session.deleteRoomConfirm", { roomName: room.name })}
					confirmText={t("session.deleteRoom")}
					cancelText={t("common.cancel")}
					onConfirm={handleDeleteRoom}
					variant="destructive"
					isLoading={isDeleting}
				/>
			</div>
		</div>
	);
}
