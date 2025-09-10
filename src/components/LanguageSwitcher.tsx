import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";

export default function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const toggleLanguage = () => {
		const newLang = i18n.language === "en" ? "zh" : "en";
		i18n.changeLanguage(newLang).then();
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleLanguage}
			className="hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
			title={i18n.language === "en" ? "切换到中文" : "Switch to English"}
		>
			<Globe className="w-5 h-5" />
		</Button>
	);
}
