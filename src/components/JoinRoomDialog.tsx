import { useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowRight,
	Link2,
	Loader2,
	Sparkles,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { safeParse } from "~/validation";
import { JoinRoomSchema } from "~/validation/schema";

export function JoinRoomDialog() {
	const navigate = useNavigate();
	const [roomCode, setRoomCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!roomCode.trim()) return;

		setError("");
		setIsLoading(true);

		// Validate room code format
		const validation = safeParse(JoinRoomSchema, {
			code: roomCode.toUpperCase(),
		});

		if (!validation.success) {
			setError("Please enter a valid 6-character room code");
			setIsLoading(false);
			return;
		}

		try {
			// Simulate API call to check if room exists
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Navigate to the sync page with the room code
			navigate({
				to: "/text-sync",
				search: { join: validation.data.code },
			});

			setIsOpen(false);
		} catch (err) {
			setError("Failed to join session. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="group  border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
				>
					<Users className="w-4 h-4 mr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
					Join a room
					<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[480px] overflow-hidden">
				<form onSubmit={handleSubmit} className="space-y-6">
					<DialogHeader className="text-center space-y-3">
						<div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-2">
							<Link2 className="w-8 h-8 text-white" />
						</div>
						<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Join Sync Session
						</DialogTitle>
						<DialogDescription className="text-base leading-relaxed">
							Enter the session code to connect with another device and start
							syncing text in real-time.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6">
						{/* Session Code Input */}
						<div className="space-y-3">
							<Label
								htmlFor="room-code"
								className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
							>
								<Sparkles className="w-4 h-4 text-blue-500" />
								Session Code
							</Label>
							<div className="relative">
								<Input
									name="roomCode"
									placeholder="ABC123"
									value={roomCode}
									onChange={(e) => {
										setRoomCode(e.target.value.toUpperCase());
										setError("");
									}}
									className={`text-center text-2xl font-mono tracking-[0.3em] uppercase h-14 border-2 transition-all duration-200 ${
										error
											? "border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20"
											: "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
									} ${roomCode.length === 6 ? "border-green-400 dark:border-green-500" : ""}`}
									maxLength={6}
									required
									autoComplete="off"
									autoFocus
								/>
								{roomCode.length === 6 && !error && (
									<div className="absolute right-3 top-1/2 -translate-y-1/2">
										<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
											{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
									</div>
								)}
							</div>

							{/* Error Message */}
							{error && (
								<div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
									<AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
									<p className="text-sm text-red-700 dark:text-red-400">
										{error}
									</p>
								</div>
							)}

							{/* Helper Text */}
							<div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
								<p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
									{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
									<svg
										className="w-4 h-4 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									Session codes are exactly 6 characters (letters and numbers)
								</p>
							</div>

							{/* Character Counter */}
							<div className="flex justify-center">
								<div className="flex gap-1">
									{Array.from({ length: 6 }).map((_, i) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={i}
											className={`w-3 h-3 rounded-full transition-all duration-200 ${
												i < roomCode.length
													? "bg-blue-500 scale-110"
													: "bg-gray-200 dark:bg-gray-600"
											}`}
										/>
									))}
								</div>
							</div>
						</div>
					</div>

					<DialogFooter className="gap-3 pt-2">
						<DialogClose asChild>
							<Button
								variant="outline"
								disabled={isLoading}
								className="flex-1 h-11"
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							disabled={!roomCode.trim() || isLoading || roomCode.length !== 6}
							className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Joining...
								</>
							) : (
								<>
									Join Session
									<ArrowRight className="w-4 h-4 ml-2" />
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
