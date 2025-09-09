import { useTheme } from "next-themes";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			// Respect app theme (light/dark/system)
			theme={theme as ToasterProps["theme"]}
			// Place toasts in the top center
			position="top-center"
			// Make colors a bit richer to match the vibrant gradient aesthetic
			richColors
			// Small close button for better UX
			closeButton
			// Default duration
			duration={2500}
			// Ensure it floats above UI and matches our glassy surfaces
			className="toaster group z-[9999]"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			toastOptions={{
				classNames: {
					// Toast container
					toast:
						"backdrop-blur-xl border rounded-xl shadow-xl " +
						"bg-white/85 text-gray-900 border-purple-200 ring-1 ring-purple-400/20 " +
						"dark:bg-gray-900/80 dark:text-gray-100 dark:border-purple-700/40 dark:ring-purple-500/15",
					// Title and description styling
					title: "font-semibold",
					description: "text-sm text-gray-600 dark:text-gray-300",
					// Action buttons styling
					actionButton:
						"bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500",
					cancelButton:
						"border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200",
				},
			}}
			{...props}
		/>
	);
};
