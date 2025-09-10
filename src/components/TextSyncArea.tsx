import { useLiveQuery } from "@tanstack/react-db";
import { Check, Copy, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

	const { data: messages, isLoading } = useLiveQuery((q) => {
		return q.from({ messages: messagesCollection }).select(({ messages }) => ({
			id: messages.id,
			title: messages.title,
			content: messages.content,
			roomId: messages.room_id,
		}));
	});

	// Find the selected message or use the first one if none selected
	const message = selectedMessageId
		? messages?.find((m) => m.id === selectedMessageId)
		: messages?.[0];

	const content = message?.content || "";

	const messageUpdate = (message: {
		id: string;
		content?: string | null;
		title?: string | null;
		roomId: string;
	}) => {
		if (!message?.id) return;

		try {
			messagesCollection.update(message.id, (draft) => {
				if (typeof message.content !== "undefined") {
					draft.content = message.content ?? undefined;
				}
				if (typeof message.title !== "undefined") {
					draft.title = message.title ?? undefined;
				}
			});
		} catch (error) {
			console.error("Failed to update message:", error);
			// Item may not be in the local collection yet due to initial sync race; ignore.
		}
	};

	const handleCopyText = async () => {
		if (content) {
			try {
				await navigator.clipboard.writeText(content);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (err) {
				console.error("Failed to copy content:", err);
			}
		}
	};

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, []);

	function handleTextChange(value: string): void {
		// Only update if we have a valid message
		if (!message?.id) return;

		const newMessage = { ...message, content: value };
		messageUpdate(newMessage);
	}

	function handleTitleChange(value: string): void {
		// Only update if we have a valid message
		if (!message?.id) return;

		const newMessage = { ...message, title: value };
		messageUpdate(newMessage);
	}

	// Show loading state while fetching messages
	if (isLoading) {
		return (
			<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden h-full flex items-center justify-center">
				<div className="text-center p-12">
					<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
						{t("textSync.loadingContent")}
					</h3>
					<p className="text-gray-600 dark:text-gray-300 max-w-sm">
						{t("textSync.loadingMessage")}
					</p>
				</div>
			</div>
		);
	}

	// If no message is selected, show a placeholder
	if (!message) {
		return (
			<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden h-full flex items-center justify-center">
				<div className="text-center p-12">
					<div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
						{t("textSync.noMessageSelected")}
					</h3>
					<p className="text-gray-600 dark:text-gray-300 max-w-sm">
						{t("textSync.noMessageDescription")}
					</p>
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
							value={message?.title || ""}
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
						value={content}
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
						{content && (
							<>
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{t("textSync.quick")}
								</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleTextChange(content.toUpperCase())}
									className="h-7 px-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
								>
									{t("textSync.uppercase")}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleTextChange(content.toLowerCase())}
									className="h-7 px-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
								>
									{t("textSync.lowercase")}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleTextChange(content.trim())}
									className="h-7 px-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
								>
									{t("textSync.trim")}
								</Button>
							</>
						)}
					</div>

					{/* Main actions */}
					<div className="flex items-center gap-3">
						{content && (
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
							disabled={!content}
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
