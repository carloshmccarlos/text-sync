import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	Clock,
	Copy,
	Monitor,
	Plus,
	Shield,
	Smartphone,
	Sparkles,
	Tablet,
} from "lucide-react";
import { JoinRoomDialog } from "~/components/JoinRoomDialog";
import ThemeToggle from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const navigate = useNavigate();

	const handleStart = () => {
		navigate({ to: "/text-sync" });
	};

	const features = [
		{
			icon: Clock,
			title: "Real-time Sync",
			description:
				"Instantly sync text across all your devices with zero delay",
		},
		{
			icon: Copy,
			title: "Universal Clipboard",
			description: "Copy on one device, paste on another - seamlessly",
		},
		{
			icon: Shield,
			title: "Secure & Private",
			description: "Your text data is encrypted and never stored permanently",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
			{/* Header */}
			<header className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
						<Copy className="w-5 h-5 text-white" />
					</div>
					<span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Text Sync
					</span>
				</div>
				<ThemeToggle />
			</header>

			{/* Main Content */}
			<div className="min-h-screen flex items-center justify-center p-4 pt-20">
				<div className="w-full max-w-6xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Column - Hero Content */}
						<div className="text-center lg:text-left space-y-8">
							<div className="space-y-4">
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
									<Sparkles className="w-4 h-4" />
									Cross-device text synchronization
								</div>
								<h1 className="text-4xl lg:text-6xl font-bold leading-tight">
									<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
										Sync Text
									</span>
									<br />
									<span className="text-gray-900 dark:text-white">
										Everywhere
									</span>
								</h1>
								<p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
									Paste text on one device and instantly access it on all your
									other devices. Real-time synchronization across phones,
									tablets, and computers.
								</p>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
								<Button
									onClick={handleStart}
									size="lg"
									className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
								>
									<Plus className="w-5 h-5 mr-2" />
									Start Syncing
									<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>
								<JoinRoomDialog />
							</div>

							{/* Stats */}
							<div className="flex justify-center lg:justify-start gap-8 pt-8">
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										5+
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Device Types
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										&lt;100ms
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Sync Speed
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										∞
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Text Length
									</div>
								</div>
							</div>
						</div>

						{/* Right Column - Features Card */}
						<div className="lg:pl-8">
							<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
								<div className="text-center mb-8">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
										How It Works
									</h2>
									<p className="text-gray-600 dark:text-gray-300">
										Simple, fast, and secure text synchronization
									</p>
								</div>

								<div className="space-y-6">
									{features.map((feature, index) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={index}
											className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
										>
											<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
												<feature.icon className="w-6 h-6 text-white" />
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 dark:text-white mb-1">
													{feature.title}
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-300">
													{feature.description}
												</p>
											</div>
										</div>
									))}
								</div>

								<div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
									<div className="flex items-center gap-3">
										<div className="flex items-center gap-1">
											<Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
											<Tablet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
											<Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<div className="font-medium text-gray-900 dark:text-white">
												All Your Devices
											</div>
											<div className="text-sm text-gray-600 dark:text-gray-300">
												Desktop, tablet, phone - sync across everything
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Background Decorations */}
			<div className="fixed inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
				<div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
			</div>
		</div>
	);
}
