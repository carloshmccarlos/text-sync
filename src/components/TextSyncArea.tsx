import { useLiveQuery } from "@tanstack/react-db";

import { Check, Copy, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { createMessagesCollection } from "~/lib/collection/messageCollection";
import { Route } from "~/routes/text-sync/$id";

import type { MessagesSelect } from "~/validation/types";

export function TextSyncArea() {
	const { id: roomId } = Route.useParams();
	const messagesCollection = createMessagesCollection(roomId);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [copied, setCopied] = useState(false);

	const messageUpdate = (message: MessagesSelect) => {
		if (!message?.id) return;

		try {
			messagesCollection.update(message.id, (draft) => {
				draft.content = message.content;
			});
		} catch (error) {
			console.warn(
				"Message not found in collection, skipping update:",
				message.id,
			);
		}
	};

	const { data: messages } = useLiveQuery((q) =>
		q.from({ messagesCollection }),
	);

	const message = messages[0];

	const content = message?.content || "";

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
		if (!message?.id) {
			console.warn("No message available to update");
			return;
		}

		const newMessage = {
			...message,
			content: value,
		};
		messageUpdate(newMessage);
	}

	return (
		<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
			{/* Header */}
			<div className="p-6 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="content-lg font-semibold content-gray-900 dark:content-white flex items-center gap-2">
							<FileText className="w-5 h-5 content-blue-600 dark:content-blue-400" />
							Synchronized content
						</h3>
						<p className="content-gray-600 dark:content-gray-300 content-sm mt-1">
							Type or paste content here - it will sync across all connected
							devices
						</p>
					</div>
				</div>
			</div>

			{/* content Area */}
			<div className="p-6">
				<div className="relative">
					<textarea
						ref={textareaRef}
						value={content}
						onChange={(e) => handleTextChange(e.target.value)}
						placeholder="Start typing or paste your content here..."
						className="w-full min-h-[300px] p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 content-gray-900 dark:content-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 font-mono content-sm leading-relaxed"
						style={{ height: "auto" }}
					/>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between mt-4">
					<div className="flex items-center gap-4 content-sm content-gray-500 dark:content-gray-400">
						<div className="flex items-center gap-2">
							<span>{content.length} characters</span>
						</div>
						<div className="flex items-center gap-2">
							<span>{content.split("\n").length} lines</span>
						</div>
						{content && (
							<div className="flex items-center gap-2">
								<span>
									{
										content.split(/\s+/).filter((word) => word.length > 0)
											.length
									}{" "}
									words
								</span>
							</div>
						)}
					</div>

					<div className="flex items-center gap-2">
						{/* Clear button */}
						{content && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleTextChange("")}
								className="content-gray-600 dark:content-gray-400 hover:content-red-600 dark:hover:content-red-400"
							>
								Clear
							</Button>
						)}

						{/* Copy button */}
						<Button
							onClick={handleCopyText}
							disabled={!content}
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 content-white transition-all duration-200 transform hover:scale-105"
						>
							{copied ? (
								<>
									<Check className="w-4 h-4 mr-2" />
									Copied!
								</>
							) : (
								<>
									<Copy className="w-4 h-4 mr-2" />
									Copy content
								</>
							)}
						</Button>
					</div>
				</div>

				{/* Quick actions */}
				{content && (
					<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-2 content-xs content-gray-500 dark:content-gray-400">
							<span>Quick actions:</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleTextChange(content.toUpperCase())}
								className="h-6 px-2 content-xs"
							>
								UPPERCASE
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleTextChange(content.toLowerCase())}
								className="h-6 px-2 content-xs"
							>
								lowercase
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleTextChange(content.trim())}
								className="h-6 px-2 content-xs"
							>
								Trim
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
