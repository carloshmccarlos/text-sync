import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import QRCode from "~/components/QRCode";
import QRCodeDialog from "~/components/QRCodeDialog";
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
		<div className="flex flex-row justify-between mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
			<div className="flex flex-col">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
							Sync Session
						</h2>
						<p className="text-gray-600 dark:text-gray-300 text-sm">
							Share this code with other devices to sync text
						</p>
					</div>
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

							<QRCodeDialog />
						</div>
					</div>
				</div>
				<p className="mt-auto text-sm text-gray-500 dark:text-gray-400">
					Your session will be not available after 24 hours, or you can delete
					it manually.
				</p>
			</div>

			{/* QR Code */}
			<div className="hidden md:flex mt-4  items-center gap-4">
				<div className="flex flex-col items-center">
					<Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Scan to join
					</Label>
					<div className=" p-2 rounded-xl bg-white/70 dark:bg-gray-900/50 border border-purple-200 dark:border-purple-800/40 shadow-sm">
						<QRCode
							value={typeof window !== "undefined" ? `${window.location}` : ""}
							className="block"
							colorDark="#6D28D9"
							colorLight="#FFFFFF00"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
