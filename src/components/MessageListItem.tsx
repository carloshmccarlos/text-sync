/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

interface MessageListItemProps {
	message: {
		id: string;
		title?: string;
		content?: string;
		roomId: string;
	};
	isSelected: boolean;
	onSelect: (messageId: string) => void;
	onDelete: (messageId: string) => void;
	onRename: (messageId: string, newTitle: string) => void;
}

export function MessageListItem({
	message,
	isSelected,
	onSelect,
	onDelete,
	onRename,
}: MessageListItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(message.title || "");

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent triggering selection

		if (
			confirm(
				"Are you sure you want to delete this message? This action cannot be undone.",
			)
		) {
			onDelete(message.id);
		}
	};

	const handleRename = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent triggering selection
		setIsEditing(true);
		setEditTitle(message.title || "");
	};

	const handleSaveRename = () => {
		if (editTitle.trim()) {
			onRename(message.id, editTitle.trim());
		}
		setIsEditing(false);
	};

	const handleCancelRename = () => {
		setIsEditing(false);
		setEditTitle(message.title || "");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSaveRename();
		} else if (e.key === "Escape") {
			handleCancelRename();
		}
	};

	const displayTitle = message.title || "Untitled Message";
	const contentPreview = message.content
		? message.content.slice(0, 100) +
			(message.content.length > 100 ? "..." : "")
		: "No content";

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		<div
			onClick={() => onSelect(message.id)}
			className={`
				group relative p-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg
				${
					isSelected
						? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-lg"
						: "bg-white/60 dark:bg-gray-700/60 border border-gray-200/60 dark:border-gray-600/60 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:border-gray-300 dark:hover:border-gray-500"
				}
			`}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-2">
						<div
							className={`w-2 h-2 rounded-full ${isSelected ? "bg-blue-500" : "bg-gray-400"}`}
						/>
						{isEditing ? (
							<input
								type="text"
								value={editTitle}
								onChange={(e) => setEditTitle(e.target.value)}
								onBlur={handleSaveRename}
								onKeyDown={handleKeyDown}
								className="font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-2 py-1 text-sm flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								onClick={(e) => e.stopPropagation()}
							/>
						) : (
							<h4
								className={`font-medium truncate text-sm ${isSelected ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-white"}`}
							>
								{displayTitle}
							</h4>
						)}
					</div>
					<p
						className={`text-xs truncate leading-relaxed ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`}
					>
						{contentPreview}
					</p>
				</div>

				<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleRename}
						className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
					>
						<Edit2 className="w-3 h-3" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleDelete}
						className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
					>
						<Trash2 className="w-3 h-3" />
					</Button>
				</div>
			</div>
		</div>
	);
}
