import { createFileRoute } from "@tanstack/react-router";

import { useEffect, useState } from "react";
import Header from "~/components/Header";
import { SessionInfoCard } from "~/components/SessionInfoCard";
import { TextSyncArea } from "~/components/TextSyncArea";

export const Route = createFileRoute("/text-sync")({
	component: TextSyncPage,
});

function TextSyncPage() {
	const [text, setText] = useState("");
	const [roomCode, setRoomCode] = useState("");
	const [isConnected, setIsConnected] = useState(false);
	const [copied, setCopied] = useState(false);
	const [lastSyncTime, setLastSyncTime] = useState<Date>();

	// Generate a random room code when component mounts
	useEffect(() => {
		const generateRoomCode = () => {
			const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			let result = "";
			for (let i = 0; i < 6; i++) {
				result += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return result;
		};

		setRoomCode(generateRoomCode());
		setIsConnected(true);
		setLastSyncTime(new Date());
	}, []);

	// Update last sync time when text changes
	useEffect(() => {
		if (text && isConnected) {
			setLastSyncTime(new Date());
		}
	}, [text, isConnected]);

	const handleTextChange = (newText: string) => {
		setText(newText);
	};

	const handleCopyText = async () => {
		if (text) {
			try {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (err) {
				console.error("Failed to copy text:", err);
			}
		}
	};

	const handleCopyRoomCode = async () => {
		try {
			await navigator.clipboard.writeText(roomCode);
			// Could add a toast notification here
		} catch (err) {
			console.error("Failed to copy room code:", err);
		}
	};

	const handleShare = async () => {
		const shareData = {
			title: "Join my text sync session",
			text: `Join my PassEverything sync session with code: ${roomCode}`,
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
				`${window.location.origin}?join=${roomCode}`,
			);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
			{/* Header */}
			<header className="p-4 border-b border-white/20 dark:border-gray-700/20 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
				<Header isConnected={isConnected} />
			</header>

			<div className="max-w-4xl mx-auto p-6 space-y-6">
				<SessionInfoCard
					roomCode={roomCode}
					deviceCount={1}
					onCopyRoomCode={handleCopyRoomCode}
					onShare={handleShare}
				/>

				<TextSyncArea
					text={text}
					onTextChange={handleTextChange}
					onCopyText={handleCopyText}
					copied={copied}
					isConnected={isConnected}
				/>
			</div>
		</div>
	);
}
