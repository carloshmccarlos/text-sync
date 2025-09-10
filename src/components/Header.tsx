import { Link } from "@tanstack/react-router";
import { Copy, Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "~/components/LanguageSwitcher";
import ThemeToggle from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";

export default function Header({
	isConnected = false,
}: {
	isConnected?: boolean;
	showBackButton?: boolean;
}) {
	const { t } = useTranslation();
	return (
		<header className="absolute top-0 left-0 right-0 z-10 p-4">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<div className="flex items-center gap-4">
					<Link to={"/"} className="flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<Copy className="w-5 h-5 text-white" />
						</div>
						<span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							{t("home.title")}
						</span>
					</Link>
				</div>

				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon"
						asChild
						className="hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
						title={t("header.viewOnGitHub")}
					>
						<a
							href="https://github.com/carloshmccarlos/text-sync"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Github className="w-5 h-5" />
						</a>
					</Button>
					{isConnected !== undefined && (
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
							{isConnected ? t("header.connected") : t("header.disconnected")}
						</div>
					)}
					<LanguageSwitcher />
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
