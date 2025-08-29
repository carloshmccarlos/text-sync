import { Check, Copy, FileText, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";

interface TextSyncAreaProps {
	text: string;
	onTextChange: (text: string) => void;
	onCopyText: () => void;
	copied: boolean;
	isConnected?: boolean;
}

export function TextSyncArea({
	text,
	onTextChange,
	onCopyText,
	copied,
	isConnected = true,
}: TextSyncAreaProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, []);

	return (
		<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
			{/* Header */}
			<div className="p-6 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
							<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
							Synchronized Text
						</h3>
						<p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
							Type or paste text here - it will sync across all connected
							devices
						</p>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Zap
								className={`w-5 h-5 ${isConnected ? "text-yellow-500" : "text-gray-400"}`}
							/>
							<span className="text-sm text-gray-600 dark:text-gray-300">
								{isConnected ? "Real-time" : "Offline"}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Text Area */}
			<div className="p-6">
				<div className="relative">
					<textarea
						ref={textareaRef}
						value={text}
						onChange={(e) => onTextChange(e.target.value)}
						placeholder="Start typing or paste your text here..."
						className="w-full min-h-[300px] p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 font-mono text-sm leading-relaxed"
						style={{ height: "auto" }}
					/>

					{/* Sync indicator overlay */}
					{isConnected && text && (
						<div className="absolute top-2 right-2">
							<div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
								<div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
								Synced
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between mt-4">
					<div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
						<div className="flex items-center gap-2">
							<span>{text.length} characters</span>
						</div>
						<div className="flex items-center gap-2">
							<span>{text.split("\n").length} lines</span>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{/* Clear button */}
						{text && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => onTextChange("")}
								className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
							>
								Clear
							</Button>
						)}

						{/* Copy button */}
						<Button
							onClick={onCopyText}
							disabled={!text}
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 transform hover:scale-105"
						>
							{copied ? (
								<>
									<Check className="w-4 h-4 mr-2" />
									Copied!
								</>
							) : (
								<>
									<Copy className="w-4 h-4 mr-2" />
									Copy Text
								</>
							)}
						</Button>
					</div>
				</div>

				{/* Quick actions */}
				{text && (
					<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
							<span>Quick actions:</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onTextChange(text.toUpperCase())}
								className="h-6 px-2 text-xs"
							>
								UPPERCASE
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onTextChange(text.toLowerCase())}
								className="h-6 px-2 text-xs"
							>
								lowercase
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onTextChange(text.trim())}
								className="h-6 px-2 text-xs"
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
