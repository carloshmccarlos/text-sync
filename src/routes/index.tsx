import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
	ArrowRight,
	Clock,
	Copy,
	Edit3,
	FileText,
	MessageSquare,
	Monitor,
	Plus,
	Shield,
	Smartphone,
	Sparkles,
	Tablet,
	Trash2,
	Users,
	Zap,
} from "lucide-react";
import { JoinRoomDialog } from "~/components/JoinRoomDialog";
import { Button } from "~/components/ui/button";
import { createMessage } from "~/serverFn/messages";
import { createRoom } from "~/serverFn/rooms";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{
				name: "description",
				content:
					"Create unlimited messages in your TextSync workspace. Real-time collaboration platform with instant synchronization across all devices. Perfect for teams, developers, and content creators.",
			},
			{
				name: "keywords",
				content:
					"create workspace, multi-message collaboration, real-time sync, team workspace, message organization, cross-device sync, instant collaboration",
			},
			{
				property: "og:title",
				content:
					"Create Your TextSync Workspace - Multi-Message Collaboration Platform",
			} as any,
			{
				property: "og:description",
				content:
					"Start collaborating with TextSync's multi-message workspace. Create, organize, and sync unlimited messages across all your devices in real-time.",
			} as any,
			{
				name: "twitter:title",
				content:
					"Create Your TextSync Workspace - Multi-Message Collaboration Platform",
			},
			{
				name: "twitter:description",
				content:
					"Start collaborating with TextSync's multi-message workspace. Create, organize, and sync unlimited messages across all your devices in real-time.",
			},
		],
	}),
	component: Home,
});

function Home() {
	const navigate = useNavigate();

	const handleStart = async () => {
		// 1) Create a new room
		const name = "New Session";
		const room = await createRoom({ data: { name } });
		if (!room?.id) return;
		// 2) Create an empty message for this room
		await createMessage({ data: { roomId: room.id } });

		// 3) Navigate to the text sync page for this room
		await navigate({ to: `/text-sync/${room.id}` });
	};

	const features = [
		{
			icon: Clock,
			title: "Real-time Collaboration",
			description:
				"Multiple messages sync instantly across all devices with zero delay",
		},
		{
			icon: Copy,
			title: "Multi-Message Workspace",
			description:
				"Organize content with multiple messages, titles, and easy navigation",
		},
		{
			icon: Shield,
			title: "Secure & Temporary",
			description:
				"Your data is encrypted and automatically deleted after 24 hours",
		},
	];

	const detailedFeatures = [
		{
			icon: MessageSquare,
			title: "Multiple Messages",
			description:
				"Create unlimited messages in each workspace. Organize different topics, code snippets, or notes separately.",
			highlight: "Unlimited messages per room",
		},
		{
			icon: Edit3,
			title: "Editable Titles",
			description:
				"Rename message titles on-the-fly with inline editing. Click the edit icon or double-click to rename instantly.",
			highlight: "Inline title editing",
		},
		{
			icon: Trash2,
			title: "Manual Delete Control",
			description:
				"Delete individual messages when you no longer need them. Full control over your content with confirmation dialogs.",
			highlight: "Individual message deletion",
		},
		{
			icon: Zap,
			title: "Instant Sync",
			description:
				"Changes appear immediately on all connected devices. No refresh needed - everything updates in real-time.",
			highlight: "< 500ms sync speed",
		},
		{
			icon: Users,
			title: "Team Collaboration",
			description:
				"Share room codes with team members. Multiple people can edit and collaborate simultaneously.",
			highlight: "Real-time collaboration",
		},
		{
			icon: FileText,
			title: "Rich Text Features",
			description:
				"Quick actions for text formatting: uppercase, lowercase, trim whitespace. Copy content with one click.",
			highlight: "Built-in text tools",
		},
	];

	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
			{/* Hero Section */}
			<section
				className="min-h-screen flex items-center justify-center p-4 pt-16 pb-8"
				aria-label="Hero section"
			>
				<div className="w-full max-w-6xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						{/* Left Column - Hero Content */}
						<article className="text-center lg:text-left space-y-8">
							<div className="space-y-4">
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
									<Sparkles className="w-4 h-4" />
									Multi-message collaboration platform
								</div>
								<h1 className="text-4xl lg:text-6xl font-bold leading-tight">
									<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
										TextSync
									</span>
									<br />
									<span className="text-gray-900 dark:text-white">
										Workspace
									</span>
								</h1>
								<p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
									Create, organize, and sync multiple messages across all your
									devices. Real-time collaboration with instant synchronization
									- perfect for notes, code snippets, and team communication.
								</p>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
								<Button
									onClick={handleStart}
									size="lg"
									className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
								>
									<Plus className="w-5 h-5 mr-2" />
									Create Workspace
									<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>
								<JoinRoomDialog />
							</div>

							{/* Stats */}
							<div className="flex justify-center lg:justify-start gap-6 sm:gap-8 pt-8 flex-wrap">
								<div className="text-center min-w-[80px]">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										Free
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										No Sign-up
									</div>
								</div>
								<div className="text-center min-w-[80px]">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										&lt;500ms
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Sync Speed
									</div>
								</div>
								<div className="text-center min-w-[80px]">
									<div className="text-2xl font-bold text-gray-900 dark:text-white">
										24h
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Auto-Delete
									</div>
								</div>
							</div>
						</article>

						{/* Right Column - Features Card */}
						<aside className="lg:pl-4" aria-label="Key features">
							<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/20 dark:border-gray-700/20">
								<div className="text-center mb-8">
									<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
										Why TextSync?
									</h2>
									<p className="text-gray-600 dark:text-gray-300">
										The modern way to sync and organize text content
									</p>
								</div>

								<div className="space-y-4">
									{features.map((feature, index) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={index}
											className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
										>
											<div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
												<feature.icon className="w-5 h-5 text-white" />
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
												Cross-Platform Workspace
											</div>
											<div className="text-sm text-gray-600 dark:text-gray-300">
												Multiple messages, real-time sync, organized content
											</div>
										</div>
									</div>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</section>

			{/* Detailed Features Section */}
			<section className="py-20 px-4" aria-label="Detailed features">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Powerful Features for Modern Collaboration
						</h2>
						<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
							Everything you need to organize, sync, and collaborate on text
							content across all your devices.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{detailedFeatures.map((feature, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-xl hover:scale-105"
							>
								<div className="flex items-center gap-4 mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
										<feature.icon className="w-6 h-6 text-white" />
									</div>
									<div>
										<h3 className="font-bold text-gray-900 dark:text-white text-lg">
											{feature.title}
										</h3>
										<div className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full inline-block">
											{feature.highlight}
										</div>
									</div>
								</div>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
									{feature.description}
								</p>
							</div>
						))}
					</div>

					{/* Call to Action */}
					<section className="text-center mt-16" aria-label="Call to action">
						<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 ">
							<h3 className="text-2xl font-bold mb-4 text-white">
								Ready to get started?
							</h3>
							<p className="text-blue-100 mb-6 max-w-2xl mx-auto">
								Create your first workspace and experience the power of
								real-time multi-message collaboration. No sign-up required,
								completely free to use.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									onClick={handleStart}
									size="lg"
									className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
								>
									<Plus className="w-5 h-5 mr-2" />
									Create Your Workspace
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
								<JoinRoomDialog />
							</div>
						</div>
					</section>
				</div>
			</section>

			{/* Background Decorations */}
			<div className="fixed inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob" />
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob animation-delay-2000" />
				<div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob animation-delay-4000" />
			</div>
		</main>
	);
}
