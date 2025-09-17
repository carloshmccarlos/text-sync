import { useLiveQuery } from "@tanstack/react-db";
import { Check, Copy, FileText, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import type { createMessagesCollection } from "~/lib/collection/messageCollection";

interface TextSyncAreaProps {
	messagesCollection: ReturnType<typeof createMessagesCollection>;
	selectedMessageId?: string;
}

export function TextSyncArea({
	messagesCollection,
	selectedMessageId,
}: TextSyncAreaProps) {
	const { t } = useTranslation();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [copied, setCopied] = useState(false);
	// State to hold the local, unsynced content
	const [localContent, setLocalContent] = useState("");
	const [localTitle, setLocalTitle] = useState("");

	const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

	const { data: messages, isLoading } = useLiveQuery((q) => {
		return q.from({ messages: messagesCollection }).select(({ messages }) => ({
			id: messages.id,
			title: messages.title,
			content: messages.content,
			roomId: messages.room_id,
		}));
	});

	const message = selectedMessageId
		? messages?.find((m) => m.id === selectedMessageId)
		: messages?.[0];

	// Effect to sync the local state with the database content when the message changes
	// This is crucial to ensure that when a new document is selected, the local state
	// reflects its content immediately.
	useEffect(() => {
		if (message) {
			setLocalContent(message.content || "");
			setLocalTitle(message.title || "");
		} else {
			setLocalContent("");
			setLocalTitle("");
		}
	}, [message]);

	const messageUpdate = useCallback(
		(messageToUpdate: {
			id: string;
			content?: string | null;
			title?: string | null;
			roomId: string;
		}) => {
			if (!messageToUpdate?.id) return;

			try {
				messagesCollection.update(messageToUpdate.id, (draft) => {
					if (typeof messageToUpdate.content !== "undefined") {
						draft.content = messageToUpdate.content ?? undefined;
					}
					if (typeof messageToUpdate.title !== "undefined") {
						draft.title = messageToUpdate.title ?? undefined;
					}
				});
			} catch (error) {
				console.error("Failed to update message:", error);
			}
		},
		[messagesCollection],
	);

	// Main debouncing logic: triggers a database update after a delay
	useEffect(() => {
		if (!message?.id) return;

		// Clear the previous timer
		if (updateTimerRef.current) {
			clearTimeout(updateTimerRef.current);
		}

		// Set a new timer
		updateTimerRef.current = setTimeout(() => {
			const currentMessage = {
				...message,
				content: localContent,
				title: localTitle,
			};
			messageUpdate(currentMessage);
			console.log("Database updated after debounce.");
		}, 500); // 500ms debounce delay

		// Cleanup function to clear the timer if the component unmounts or dependencies change
		return () => {
			if (updateTimerRef.current) {
				clearTimeout(updateTimerRef.current);
			}
		};
	}, [localContent, localTitle, message, messageUpdate]);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, []); // Adjust this dependency to use localContent

	const handleCopyText = async () => {
		if (localContent) {
			// Use localContent here
			try {
				await navigator.clipboard.writeText(localContent);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (err) {
				console.error("Failed to copy content:", err);
			}
		}
	};

	function handleTextChange(value: string): void {
		setLocalContent(value);
	}

	function handleTitleChange(value: string): void {
		setLocalTitle(value);
	}

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

	return (
		<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden h-full flex flex-col">
			{/* Header */}
			<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
						<FileText className="w-4 h-4 text-white" />
					</div>
					<div className="flex-1">
						<input
							type="text"
							value={localTitle}
							onChange={(e) => handleTitleChange(e.target.value)}
							placeholder={t("textSync.messageTitlePlaceholder")}
							className="text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 placeholder-gray-500 dark:placeholder-gray-400 w-full"
						/>
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{t("textSync.realTimeSync")}
						</p>
					</div>
				</div>
			</div>

			{/* Content Area */}
			<div className="flex-1 p-6 flex flex-col min-h-0">
				<div className="flex-1 relative">
					<textarea
						ref={textareaRef}
						value={localContent}
						onChange={(e) => handleTextChange(e.target.value)}
						placeholder={t("textSync.typeHere")}
						disabled={!message}
						className="w-full h-full p-4 border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:outline-none resize-none font-mono text-sm leading-relaxed"
					/>
				</div>

				{/* Footer Actions */}
				<div className="sm:flex-row gap-2 flex-col items-end flex sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
					{/* Quick actions */}
					<div className="flex items-center gap-2">
						{localContent && (
							<>
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{t("textSync.quick")}
								</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleTextChange(localContent.toUpperCase())}
									className="h-7 px-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
								>
									{t("textSync.uppercase")}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleTextChange(localContent.toLowerCase())}
									className="h-7 px-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
								>
									{t("textSync.lowercase")}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleTextChange(localContent.trim())}
									className="h-7 px-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
								>
									{t("textSync.trim")}
								</Button>
							</>
						)}
					</div>

					{/* Main actions */}
					<div className="flex items-center gap-3">
						{localContent && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleTextChange("")}
								className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700"
							>
								{t("textSync.clear")}
							</Button>
						)}
						<Button
							onClick={handleCopyText}
							disabled={!localContent}
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
						>
							{copied ? (
								<>
									<Check className="w-4 h-4 mr-2" />
									{t("textSync.copied")}
								</>
							) : (
								<>
									<Copy className="w-4 h-4 mr-2" />
									{t("textSync.copyText")}
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
