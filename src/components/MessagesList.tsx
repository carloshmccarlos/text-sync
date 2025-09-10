import { useLiveQuery } from "@tanstack/react-db";
import { MessageSquare, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageListItem } from "~/components/MessageListItem";
import { Button } from "~/components/ui/button";
import type { createMessagesCollection } from "~/lib/collection/messageCollection";
import {
	createMessage,
	deleteMessage,
	updateMessage,
} from "~/serverFn/messages";

interface MessagesListProps {
	messagesCollection: ReturnType<typeof createMessagesCollection>;
	selectedMessageId?: string;
	onSelectMessage: (messageId: string) => void;
	roomId: string;
}

export function MessagesList({
	selectedMessageId,
	onSelectMessage,
	roomId,
	messagesCollection,
}: MessagesListProps) {
	const { t } = useTranslation();
	const [isCreatingMessage, setIsCreatingMessage] = useState(false);

	const { data: messages, isLoading } = useLiveQuery((q) => {
		return q.from({ messages: messagesCollection }).select(({ messages }) => ({
			id: messages.id,
			title: messages.title,
			content: messages.content,
			roomId: messages.room_id,
		}));
	});

	const handleCreateMessage = async () => {
		setIsCreatingMessage(true);
		try {
			const newMessage = await createMessage({
				data: {
					roomId: roomId,
					title: t("messages.newMessage"),
					content: "",
				},
			});

			if (newMessage) {
				// Automatically select the new message for editing
				onSelectMessage(newMessage.id);
			}
		} catch (error) {
			console.error("Failed to create message:", error);
			alert(t("messages.failedToCreate"));
		} finally {
			setIsCreatingMessage(false);
		}
	};

	const handleDeleteMessage = async (messageId: string) => {
		try {
			await deleteMessage({ data: { id: messageId } });

			// If the deleted message was selected, clear selection
			if (selectedMessageId === messageId) {
				// Select the first remaining message, if any
				const remainingMessages = messages?.filter((m) => m.id !== messageId);
				if (remainingMessages && remainingMessages.length > 0) {
					onSelectMessage(remainingMessages[0].id);
				} else {
					onSelectMessage("");
				}
			}
		} catch (error) {
			console.error("Failed to delete message:", error);
			alert(t("messagesList.failedToDelete"));
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
			alert(t("messages.failedToRename"));
		}
	};

	// Show loading state while fetching messages
	if (isLoading) {
		return (
			<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden h-full flex flex-col">
				{/* Header */}
				<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<MessageSquare className="w-4 h-4 text-white" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								{t("messagesList.messages")}
							</h3>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{t("messagesList.loading")}
							</p>
						</div>
					</div>
				</div>

				{/* Loading State */}
				<div className="flex-1 flex items-center justify-center p-8">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
						<h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							{t("messagesList.loadingMessages")}
						</h4>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							{t("messagesList.loadingDescription")}
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Show empty state if no messages
	if (!messages || messages.length === 0) {
		return (
			<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden h-full flex flex-col">
				{/* Header */}
				<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<MessageSquare className="w-4 h-4 text-white" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								{t("messagesList.messages")}
							</h3>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{t("messagesList.noMessagesYet")}
							</p>
						</div>
					</div>
					<Button
						onClick={handleCreateMessage}
						disabled={isCreatingMessage}
						className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white shadow-lg hover:shadow-xl transition-all duration-200"
					>
						{isCreatingMessage ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
								{t("messagesList.creating")}
							</>
						) : (
							<>
								<Plus className="w-4 h-4 mr-2" />
								{t("messagesList.createFirstMessageButton")}
							</>
						)}
					</Button>
				</div>

				{/* Empty State */}
				<div className="flex-1 flex items-center justify-center p-8">
					<div className="text-center">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
						</div>
						<h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							{t("messagesList.startCollaborating")}
						</h4>
						<p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
							{t("messagesList.createFirstMessage")}
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden h-full flex flex-col">
			{/* Header */}
			<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
						<MessageSquare className="w-4 h-4 text-white" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							{t("messagesList.messages")}
						</h3>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{t("messagesList.messageCount", { count: messages.length })}
						</p>
					</div>
				</div>
				<Button
					onClick={handleCreateMessage}
					disabled={isCreatingMessage}
					className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white shadow-lg hover:shadow-xl transition-all duration-200"
				>
					{isCreatingMessage ? (
						<>
							<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
							{t("messagesList.creating")}
						</>
					) : (
						<>
							<Plus className="w-4 h-4 mr-2" />
							{t("messagesList.newMessage")}
						</>
					)}
				</Button>
			</div>

			{/* Messages List */}
			<div className="flex-1 p-4 overflow-hidden">
				<div className="space-y-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
					{messages.map((message) => (
						<MessageListItem
							key={message.id}
							message={message}
							isSelected={selectedMessageId === message.id}
							onSelect={onSelectMessage}
							onDelete={handleDeleteMessage}
							onRename={handleRenameMessage}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
