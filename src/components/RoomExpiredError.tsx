import { Link } from "@tanstack/react-router";

interface RoomExpiredErrorProps {
	roomId: string;
}

export function RoomExpiredError({ roomId }: RoomExpiredErrorProps) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900 dark:to-orange-900 flex items-center justify-center">
			<div className="max-w-md mx-auto p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 dark:border-red-800">
				<div className="text-center space-y-6">
					<div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
						{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
						<svg
							className="w-8 h-8 text-red-600 dark:text-red-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>

					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							Room Expired
						</h1>
						<p className="text-gray-600 dark:text-gray-300 mb-4">
							This room (ID:{" "}
							<code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
								{roomId}
							</code>
							) has expired. Rooms are automatically deleted after 24 hours for
							security and storage reasons.
						</p>
					</div>

					<div className="space-y-3">
						<Link
							to="/"
							className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
						>
							Create New Room
						</Link>
						<Link
							to="/"
							className="block w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors"
						>
							Back to Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
