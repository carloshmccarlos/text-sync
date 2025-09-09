import { QrCode } from "lucide-react";
import { useState } from "react";
import QRCode from "~/components/QRCode";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
export default function QRCodeDialog() {
	const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

	return (
		<Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="md:hidden shrink-0 hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors"
					title="Show QR Code"
				>
					<QrCode className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Scan to Join Session</DialogTitle>
					<DialogDescription>
						Scan this QR code with another device to join the sync session
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-center pb-6">
					<div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800/40 shadow-sm">
						<QRCode
							value={typeof window !== "undefined" ? `${window.location}` : ""}
							className="block"
							colorDark="#6D28D9"
							colorLight="#FFFFFF00"
							size={200}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
