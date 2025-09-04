import { Copy, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

interface SessionInfoCardProps {
	roomId: string;
}

export function SessionInfoCard({ roomId }: SessionInfoCardProps) {
	const handleCopyRoomId = async () => {
		try {
			await navigator.clipboard.writeText(roomId);
			toast.success("Room ID copied to clipboard");
			// Could add a toast notification here
		} catch (err) {
			console.error("Failed to copy room code:", err);
		}
	};

	const handleShare = async () => {
		const shareData = {
			title: "Join my text sync session",
			text: `Join my PassEverything sync session with code: ${roomId}`,
			url: window.location.href,
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				console.error("Error sharing:", err);
			}
		} else {
			// Fallback to copying URL
			await navigator.clipboard.writeText(
				`${window.location.origin}?join=${roomId}`,
			);
		}
	};
	return (
		<div className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
						Sync Session
					</h2>
					<p className="text-gray-600 dark:text-gray-300 text-sm">
						Share this code with other devices to sync text
					</p>
				</div>
				{/*	<div className="flex items-center gap-2">
					<Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
				</div>*/}
			</div>

			<div className="flex items-center gap-3">
				<div className="flex-1">
					<Label
						htmlFor="room-code"
						className="text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Session Code
					</Label>
					<div className="mt-1 flex items-center gap-2">
						<div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-lg tracking-wider text-center min-w-[120px] select-all">
							{roomId}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleCopyRoomId}
							className="shrink-0 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
							title="Copy session code"
						>
							<Copy className="w-4 h-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleShare}
							className="shrink-0 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
							title="Share session"
						>
							<Share2 className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Additional session info */}
			{/*<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							<span className="text-gray-600 dark:text-gray-300">
								Active Session
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
							<span className="text-gray-600 dark:text-gray-300">
								Real-time Sync
							</span>
						</div>
					</div>
				</div>
			</div>*/}
		</div>
	);
}
