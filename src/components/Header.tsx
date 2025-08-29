import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Header({
	isConnected = false,
}: {
	isConnected?: boolean;
}) {
	const navigate = useNavigate();

	return (
		<div className="max-w-4xl mx-auto flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate({ to: "/" })}
					className="hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
					title="Back to home"
				>
					<ArrowLeft className="w-5 h-5" />
				</Button>
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
						<Copy className="w-5 h-5 text-white" />
					</div>
					<span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Text Sync
					</span>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div
					className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
						isConnected
							? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
							: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
					}`}
				>
					<div
						className={`w-2 h-2 rounded-full ${
							isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
						}`}
					></div>
					{isConnected ? "Connected" : "Disconnected"}
				</div>
			</div>
		</div>
	);
}
