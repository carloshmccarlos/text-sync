import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Utility function to detect and convert browser language
const detectBrowserLanguage = (): string => {
	if (typeof window === "undefined") {
		return "en"; // Default for SSR
	}

	// Check localStorage first
	const storedLang = localStorage.getItem("i18nextLng");
	if (storedLang && ["en", "zh"].includes(storedLang)) {
		return storedLang;
	}

	// Get browser languages in order of preference
	const browserLanguages = [
		navigator.language,
		...(navigator.languages || []),
	].filter(Boolean);

	for (const lang of browserLanguages) {
		const normalizedLang = lang.toLowerCase();
		
		// Handle Chinese variants
		if (normalizedLang.startsWith("zh")) {
			return "zh";
		}
		
		// Handle English variants
		if (normalizedLang.startsWith("en")) {
			return "en";
		}
	}

	// Default fallback
	return "en";
};

const resources = {
	en: {
		translation: {
			// Common
			"common.cancel": "Cancel",

			// Header
			"header.backToHome": "Back to home",
			"header.viewOnGitHub": "View on GitHub",
			"header.connected": "Connected",
			"header.disconnected": "Disconnected",

			// Home page
			"home.title": "TextSync",
			"home.subtitle": "Workspace",
			"home.description":
				"Create, organize, and sync multiple messages across all your devices. Real-time collaboration with instant synchronization - perfect for notes, code snippets, and team communication.",
			"home.createWorkspace": "Create Workspace",
			"home.joinRoom": "Join Room",
			"home.multiMessagePlatform": "Multi-message collaboration platform",
			"home.whyTextSync": "Why TextSync?",
			"home.modernWayToSync":
				"The modern way to sync and organize text content",
			"home.free": "Free",
			"home.noSignUp": "No Sign-up",
			"home.syncSpeed": "Sync Speed",
			"home.autoDelete": "Auto-Delete",
			"home.crossPlatformWorkspace": "Cross-Platform Workspace",
			"home.multipleMessagesRealTimeSync":
				"Multiple messages, real-time sync, organized content",

			// Features
			"features.realTimeCollaboration": "Real-time Collaboration",
			"features.realTimeCollaborationDesc":
				"Multiple messages sync instantly across all devices with zero delay",
			"features.multiMessageWorkspace": "Multi-Message Workspace",
			"features.multiMessageWorkspaceDesc":
				"Organize content with multiple messages, titles, and easy navigation",
			"features.secureTemporary": "Secure & Temporary",
			"features.secureTemporaryDesc":
				"Your data is encrypted and automatically deleted after 24 hours",

			// Detailed features
			"features.multipleMessages": "Multiple Messages",
			"features.multipleMessagesDesc":
				"Create unlimited messages in each workspace. Organize different topics, code snippets, or notes separately.",
			"features.unlimitedMessages": "Unlimited messages per room",
			"features.editableTitles": "Editable Titles",
			"features.editableTitlesDesc":
				"Rename message titles on-the-fly with inline editing. Click the edit icon or double-click to rename instantly.",
			"features.inlineTitleEditing": "Inline title editing",
			"features.manualDeleteControl": "Manual Delete Control",
			"features.manualDeleteControlDesc":
				"Delete individual messages when you no longer need them. Full control over your content with confirmation dialogs.",
			"features.individualMessageDeletion": "Individual message deletion",
			"features.instantSync": "Instant Sync",
			"features.instantSyncDesc":
				"Changes appear immediately on all connected devices. No refresh needed - everything updates in real-time.",
			"features.syncSpeed500ms": "< 500ms sync speed",
			"features.teamCollaboration": "Team Collaboration",
			"features.teamCollaborationDesc":
				"Share room codes with team members. Multiple people can edit and collaborate simultaneously.",
			"features.realTimeCollaborationFeature": "Real-time collaboration",
			"features.richTextFeatures": "Rich Text Features",
			"features.richTextFeaturesDesc":
				"Quick actions for text formatting: uppercase, lowercase, trim whitespace. Copy content with one click.",
			"features.builtInTextTools": "Built-in text tools",

			// Call to action
			"cta.readyToStart": "Ready to get started?",
			"cta.description":
				"Create your first workspace and experience the power of real-time multi-message collaboration. No sign-up required, completely free to use.",
			"cta.createYourWorkspace": "Create Your Workspace",
			"cta.powerfulFeatures": "Powerful Features for Modern Collaboration",
			"cta.everythingYouNeed":
				"Everything you need to organize, sync, and collaborate on text content across all your devices.",

			// Messages
			"messages.untitledMessage": "Untitled Message",
			"messages.noContent": "No content",
			"messages.newMessage": "New Message",
			"messages.delete": "Delete",
			"messages.deleteMessageTitle": "Delete Message",
			"messages.deleteConfirm":
				"Are you sure you want to delete this message? This action cannot be undone.",
			"messages.failedToCreate": "Failed to create message. Please try again.",
			"messages.failedToRename": "Failed to rename message. Please try again.",

			// Room/Session
			"session.deleteRoom": "Delete Room",
			"session.deleteRoomTitle": "Delete Room",
			"session.deleting": "Deleting...",
			"session.deleteRoomConfirm":
				'Are you sure you want to delete room "{{roomName}}"? This action cannot be undone.',
			"session.failedToDelete": "Failed to delete room. Please try again.",
			"session.newSession": "New Session",

			// Text sync area
			"textSync.typeHere": "Start typing or paste your content here...",
			"textSync.copy": "Copy",
			"textSync.copied": "Copied!",
			"textSync.copyText": "Copy Text",
			"textSync.uppercase": "UPPER",
			"textSync.lowercase": "lower",
			"textSync.trim": "Trim",
			"textSync.clear": "Clear",
			"textSync.quick": "Quick:",
			"textSync.messageTitlePlaceholder": "Message title...",
			"textSync.realTimeSync": "Real-time sync across all devices",
			"textSync.loadingContent": "Loading content",
			"textSync.loadingMessage":
				"Please wait while we load your message content...",
			"textSync.noMessageSelected": "No message selected",
			"textSync.noMessageDescription":
				"Select a message from the sidebar to start editing, or create a new one to begin collaborating.",

			// Join room dialog
			"joinRoom.title": "Join Room",
			"joinRoom.description": "Enter a room code to join an existing workspace",
			"joinRoom.roomCode": "Room Code",
			"joinRoom.placeholder": "Enter room code...",
			"joinRoom.cancel": "Cancel",
			"joinRoom.join": "Join Room",
			"joinRoom.joining": "Joining",

			// Room expired
			"roomExpired.title": "Room Expired",
			"roomExpired.description":
				"This room has expired and is no longer available. Rooms are automatically deleted after 24 hours for security.",
			"roomExpired.backToHome": "Back to Home",

			// Session info
			"sessionInfo.syncSession": "Sync Session",
			"sessionInfo.shareCode":
				"Share this code with other devices to sync text",
			"sessionInfo.sessionCode": "Session Code",
			"sessionInfo.roomCode": "Room Code",
			"sessionInfo.copy": "Copy",
			"sessionInfo.copied": "Copied!",
			"sessionInfo.copySessionCode": "Copy session code",
			"sessionInfo.shareSession": "Share session",
			"sessionInfo.scanToJoin": "Scan to join",
			"sessionInfo.sessionExpiry":
				"Your session will be not available after 24 hours, or you can delete it manually.",
			"sessionInfo.roomIdCopied": "Room ID copied to clipboard",
			"sessionInfo.joinMySession": "Join my text sync session",
			"sessionInfo.joinMySessionText":
				"Join my PassEverything sync session with code: {{roomId}}",

			// Messages List
			"messagesList.messages": "Messages",
			"messagesList.loading": "Loading...",
			"messagesList.loadingMessages": "Loading messages",
			"messagesList.loadingDescription":
				"Please wait while we fetch your messages...",
			"messagesList.noMessagesYet": "No messages yet",
			"messagesList.startCollaborating": "Start collaborating",
			"messagesList.createFirstMessage":
				"Create your first message to begin sharing content across devices.",
			"messagesList.createFirstMessageButton": "Create First Message",
			"messagesList.creating": "Creating...",
			"messagesList.newMessage": "New Message",
			"messagesList.messageCount": "{{count}} message",
			"messagesList.messageCount_plural": "{{count}} messages",
			"messagesList.failedToDelete":
				"Failed to delete message. Please try again.",

			// Join Room Dialog
			"joinRoom.sessionCodeHelper":
				"Session codes are exactly 6 characters (letters and numbers)",
			"joinRoom.failedToJoin": "Failed to join session. Please try again.",

			// SEO
			"seo.title": "TextSync — Online Clipboard & Cross-Device Text Sync",
			"seo.description":
				"Instantly sync text, clipboard content, and messages across all your devices. Free online clipboard with real-time synchronization, secure temporary storage, and cross-platform support. No registration required.",
			"seo.keywords":
				"online clipboard, cross device clipboard, text sync, clipboard sync, copy paste between devices, secure clipboard, temporary text storage, cross platform clipboard, device synchronization, instant text sharing, clipboard sharing, remote clipboard, universal clipboard, multi device clipboard, clipboard manager",
			"seo.ogTitle": "TextSync — Online Clipboard & Cross-Device Text Sync",
			"seo.ogDescription":
				"Instantly sync text, clipboard content, and messages across all your devices. Free online clipboard with real-time synchronization, secure temporary storage, and cross-platform support. No registration required.",
			"seo.twitterTitle":
				"TextSync — Online Clipboard & Cross-Device Text Sync",
			"seo.twitterDescription":
				"Instantly sync text, clipboard content, and messages across all your devices. Free online clipboard with real-time synchronization, secure temporary storage, and cross-platform support. No registration required.",
			"seo.appName": "TextSync - Online Clipboard & Text Sync",
			"seo.appDescription":
				"Cross-device clipboard synchronization and real-time text sync application",
			"seo.imageAlt": "TextSync - Online Clipboard & Cross-Device Text Sync",

			// Home page SEO
			"seo.home.title":
				"Create Your TextSync Workspace - Multi-Message Collaboration Platform",
			"seo.home.description":
				"Create unlimited messages in your TextSync workspace. Real-time collaboration platform with instant synchronization across all devices. Perfect for teams, developers, and content creators.",
			"seo.home.keywords":
				"create workspace, multi-message collaboration, real-time sync, team workspace, message organization, cross-device sync, instant collaboration",
			"seo.home.ogTitle":
				"Create Your TextSync Workspace - Multi-Message Collaboration Platform",
			"seo.home.ogDescription":
				"Start collaborating with TextSync's multi-message workspace. Create, organize, and sync unlimited messages across all your devices in real-time.",
		},
	},
	zh: {
		translation: {
			// Common
			"common.cancel": "取消",

			// Header
			"header.backToHome": "返回首页",
			"header.viewOnGitHub": "在 GitHub 上查看",
			"header.connected": "已连接",
			"header.disconnected": "未连接",

			// Home page
			"home.title": "文本同步",
			"home.subtitle": "工作空间",
			"home.description":
				"在所有设备上创建、组织和同步多条消息。实时协作，即时同步 - 非常适合笔记、代码片段和团队沟通。",
			"home.createWorkspace": "创建工作空间",
			"home.joinRoom": "加入房间",
			"home.multiMessagePlatform": "多消息协作平台",
			"home.whyTextSync": "为什么选择文本同步？",
			"home.modernWayToSync": "同步和组织文本内容的现代方式",
			"home.free": "免费",
			"home.noSignUp": "无需注册",
			"home.syncSpeed": "同步速度",
			"home.autoDelete": "自动删除",
			"home.crossPlatformWorkspace": "跨平台工作空间",
			"home.multipleMessagesRealTimeSync": "多条消息，实时同步，有序内容",

			// Features
			"features.realTimeCollaboration": "实时协作",
			"features.realTimeCollaborationDesc":
				"多条消息在所有设备上即时同步，零延迟",
			"features.multiMessageWorkspace": "多消息工作空间",
			"features.multiMessageWorkspaceDesc":
				"通过多条消息、标题和简单导航来组织内容",
			"features.secureTemporary": "安全且临时",
			"features.secureTemporaryDesc": "您的数据经过加密，24小时后自动删除",

			// Detailed features
			"features.multipleMessages": "多条消息",
			"features.multipleMessagesDesc":
				"在每个工作空间中创建无限条消息。分别组织不同的主题、代码片段或笔记。",
			"features.unlimitedMessages": "每个房间无限消息",
			"features.editableTitles": "可编辑标题",
			"features.editableTitlesDesc":
				"通过内联编辑即时重命名消息标题。点击编辑图标或双击即可立即重命名。",
			"features.inlineTitleEditing": "内联标题编辑",
			"features.manualDeleteControl": "手动删除控制",
			"features.manualDeleteControlDesc":
				"当您不再需要时删除单个消息。通过确认对话框完全控制您的内容。",
			"features.individualMessageDeletion": "单个消息删除",
			"features.instantSync": "即时同步",
			"features.instantSyncDesc":
				"更改立即出现在所有连接的设备上。无需刷新 - 一切都实时更新。",
			"features.syncSpeed500ms": "< 500毫秒同步速度",
			"features.teamCollaboration": "团队协作",
			"features.teamCollaborationDesc":
				"与团队成员分享房间代码。多人可以同时编辑和协作。",
			"features.realTimeCollaborationFeature": "实时协作",
			"features.richTextFeatures": "富文本功能",
			"features.richTextFeaturesDesc":
				"文本格式化的快速操作：大写、小写、修剪空白。一键复制内容。",
			"features.builtInTextTools": "内置文本工具",

			// Call to action
			"cta.readyToStart": "准备开始了吗？",
			"cta.description":
				"创建您的第一个工作空间，体验实时多消息协作的强大功能。无需注册，完全免费使用。",
			"cta.createYourWorkspace": "创建您的工作空间",
			"cta.powerfulFeatures": "现代协作的强大功能",
			"cta.everythingYouNeed":
				"您需要的一切，用于在所有设备上组织、同步和协作文本内容。",

			// Messages
			"messages.untitledMessage": "无标题消息",
			"messages.noContent": "无内容",
			"messages.newMessage": "新消息",
			"messages.delete": "删除",
			"messages.deleteMessageTitle": "删除消息",
			"messages.deleteConfirm": "您确定要删除此消息吗？此操作无法撤销。",
			"messages.failedToCreate": "创建消息失败。请重试。",
			"messages.failedToRename": "重命名消息失败。请重试。",

			// Room/Session
			"session.deleteRoom": "删除房间",
			"session.deleteRoomTitle": "删除房间",
			"session.deleting": "删除中...",
			"session.deleteRoomConfirm": "您确定要删除房间吗？此操作无法撤销。",
			"session.failedToDelete": "删除房间失败。请重试。",
			"session.newSession": "新会话",

			// Text sync area
			"textSync.typeHere": "在此开始输入或粘贴您的内容...",
			"textSync.copy": "复制",
			"textSync.copied": "已复制！",
			"textSync.copyText": "复制文本",
			"textSync.uppercase": "大写",
			"textSync.lowercase": "小写",
			"textSync.trim": "修剪",
			"textSync.clear": "清除",
			"textSync.quick": "快速：",
			"textSync.messageTitlePlaceholder": "消息标题...",
			"textSync.realTimeSync": "跨所有设备实时同步",
			"textSync.loadingContent": "加载内容中",
			"textSync.loadingMessage": "请稍候，我们正在加载您的消息内容...",
			"textSync.noMessageSelected": "未选择消息",
			"textSync.noMessageDescription":
				"从侧边栏选择一条消息开始编辑，或创建新消息开始协作。",

			// Join room dialog
			"joinRoom.title": "加入房间",
			"joinRoom.description": "输入房间代码以加入现有工作空间",
			"joinRoom.roomCode": "房间代码",
			"joinRoom.placeholder": "输入房间代码...",
			"joinRoom.cancel": "取消",
			"joinRoom.join": "加入房间",
			"joinRoom.joining": "加入中",

			// Room expired
			"roomExpired.title": "房间已过期",
			"roomExpired.description":
				"此房间已过期，不再可用。为了安全起见，房间会在24小时后自动删除。",
			"roomExpired.backToHome": "返回首页",

			// Session info
			"sessionInfo.syncSession": "同步会话",
			"sessionInfo.shareCode": "与其他设备分享此代码以同步文本",
			"sessionInfo.sessionCode": "会话代码",
			"sessionInfo.roomCode": "房间代码",
			"sessionInfo.copy": "复制",
			"sessionInfo.copied": "已复制！",
			"sessionInfo.copySessionCode": "复制会话代码",
			"sessionInfo.shareSession": "分享会话",
			"sessionInfo.scanToJoin": "扫码加入",
			"sessionInfo.sessionExpiry":
				"您的会话将在24小时后不可用，或者您可以手动删除。",
			"sessionInfo.roomIdCopied": "房间ID已复制到剪贴板",
			"sessionInfo.joinMySession": "加入我的文本同步会话",
			"sessionInfo.joinMySessionText":
				"使用代码加入我的PassEverything同步会话：{{roomId}}",

			// Messages List
			"messagesList.messages": "消息",
			"messagesList.loading": "加载中...",
			"messagesList.loadingMessages": "加载消息中",
			"messagesList.loadingDescription": "请稍候，我们正在获取您的消息...",
			"messagesList.noMessagesYet": "暂无消息",
			"messagesList.startCollaborating": "开始协作",
			"messagesList.createFirstMessage":
				"创建您的第一条消息以开始跨设备分享内容。",
			"messagesList.createFirstMessageButton": "创建第一条消息",
			"messagesList.creating": "创建中...",
			"messagesList.newMessage": "新消息",
			"messagesList.messageCount": "{{count}} 条消息",
			"messagesList.messageCount_plural": "{{count}} 条消息",
			"messagesList.failedToDelete": "删除消息失败。请重试。",

			// Join Room Dialog
			"joinRoom.sessionCodeHelper": "会话代码恰好是6个字符（字母和数字）",
			"joinRoom.failedToJoin": "加入会话失败。请重试。",
		},
	},
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		supportedLngs: ["en", "zh"],
		nonExplicitSupportedLngs: true,
		debug: false,
		// Prevent hydration issues
		react: {
			useSuspense: false,
		},
		// Set initial language based on detection
		lng: detectBrowserLanguage(),

		interpolation: {
			escapeValue: false, // React already escapes values
		},

		detection: {
			// Detection order: localStorage first, then browser language, then HTML lang attribute
			order:
				typeof window !== "undefined"
					? ["localStorage", "navigator", "htmlTag", "querystring", "cookie"]
					: ["htmlTag"],
			caches: ["localStorage"],
			
			// localStorage settings
			lookupLocalStorage: "i18nextLng",
			
			// Navigator/browser language settings
			lookupFromNavigator: true,
			checkWhitelist: true,
			
			// HTML lang attribute
			lookupFromPathIndex: 0,
			lookupFromSubdomainIndex: 0,
			
			// Query string and cookie support (optional)
			lookupQuerystring: "lng",
			lookupCookie: "i18next",
			
			// Convert browser language codes to our supported languages
			convertDetectedLanguage: (lng: string) => {
				console.log("Detected browser language:", lng);
				
				// Handle Chinese variants (zh, zh-CN, zh-TW, zh-HK, etc.)
				if (lng.toLowerCase().startsWith("zh")) {
					return "zh";
				}
				
				// Handle English variants (en, en-US, en-GB, etc.)
				if (lng.toLowerCase().startsWith("en")) {
					return "en";
				}
				
				// For other languages, check if we support them
				const supportedLanguages = ["en", "zh"];
				const baseLang = lng.split("-")[0].toLowerCase();
				
				if (supportedLanguages.includes(baseLang)) {
					return baseLang;
				}
				
				// Default to English for unsupported languages
				console.log("Unsupported language detected, falling back to English:", lng);
				return "en";
			},
		},
	});

// Enhanced client-side language detection
if (typeof window !== "undefined") {
	// Initialize language detection after hydration
	const initializeLanguage = () => {
		const detectedLang = detectBrowserLanguage();
		
		// Only change language if it's different from current
		if (i18n.language !== detectedLang) {
			console.log("Browser language detected:", navigator.language, "-> Setting to:", detectedLang);
			i18n.changeLanguage(detectedLang);
		}
		
		// Update HTML lang attribute
		document.documentElement.lang = detectedLang === "zh" ? "zh-CN" : "en";
	};
	
	// Run initialization
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializeLanguage);
	} else {
		// DOM is already ready, run immediately
		initializeLanguage();
	}
	
	// Listen for language changes and update HTML lang attribute
	i18n.on("languageChanged", (lng) => {
		document.documentElement.lang = lng === "zh" ? "zh-CN" : "en";
		console.log("Language changed to:", lng);
	});
}

export default i18n;
