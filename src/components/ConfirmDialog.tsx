import { AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	variant?: "default" | "destructive";
	isLoading?: boolean;
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	variant = "default",
	isLoading = false,
}: ConfirmDialogProps) {
	const handleConfirm = () => {
		onConfirm();
	};

	const handleCancel = () => {
		if (!isLoading) {
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						{variant === "destructive" && (
							<div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
								<AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
							</div>
						)}
						<div className="flex-1">
							<DialogTitle className="text-left">{title}</DialogTitle>
						</div>
					</div>
					<DialogDescription className="text-left">
						{description}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={handleCancel} disabled={isLoading}>
						{cancelText}
					</Button>
					<Button
						variant={variant === "destructive" ? "destructive" : "default"}
						onClick={handleConfirm}
						disabled={isLoading}
					>
						{isLoading && (
							// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
							<svg
								className="animate-spin -ml-1 mr-2 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
						)}
						{confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
