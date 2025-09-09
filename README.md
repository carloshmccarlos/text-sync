# 📋 TextSync - Real-time Multi-Message Collaboration Platform

<div align="center">

![TextSync Logo](https://img.shields.io/badge/TextSync-Multi--Message%20Workspace-blue?style=for-the-badge&logo=clipboard&logoColor=white)

**Create, organize, and sync unlimited messages across all your devices in real-time**

[![License](https://img.shields.io/badge/license-Unlicense-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![TanStack](https://img.shields.io/badge/TanStack-Start-orange.svg)](https://tanstack.com/start)

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🛠️ Installation](#getting-started) • [🤝 Contributing](#contributing)

</div>

---

## ✨ Features

### 🔄 **Real-time Collaboration**
- **Instant Sync**: Changes appear across all devices in < 500ms
- **Multi-Device Support**: Seamlessly works on phones, tablets, and computers
- **Live Collaboration**: Multiple users can edit simultaneously

### 📝 **Multi-Message Workspace**
- **Unlimited Messages**: Create and organize multiple messages per room
- **Editable Titles**: Rename messages with inline editing (double-click or edit icon)
- **Individual Management**: Delete specific messages with confirmation dialogs
- **Auto-Selection**: Smart message selection when navigating from home

### 🎨 **Modern User Experience**
- **Beautiful UI**: Gradient backgrounds with glassmorphism design
- **Dark/Light Mode**: Automatic theme switching with system preference
- **Responsive Design**: Optimized for all screen sizes
- **Rich Text Tools**: Quick actions for uppercase, lowercase, and trim operations

### 🔒 **Privacy & Security**
- **No Sign-up Required**: Start using immediately without registration
- **Auto-Delete**: Rooms automatically expire after 24 hours
- **Secure Sharing**: Share rooms via QR codes or room IDs
- **Temporary Storage**: Data is automatically cleaned up for privacy

### ⚡ **Developer Experience**
- **Real-time Database**: Built with Electric SQL for instant synchronization
- **Type Safety**: Full TypeScript support throughout the application
- **Modern Stack**: React 19, TanStack Router, Tailwind CSS v4
- **Optimistic Updates**: Immediate UI feedback with server reconciliation

---

## 🛠️ Tech Stack

<div align="center">

| Frontend                                                                                         | Backend | Database | Styling | Tools |
|--------------------------------------------------------------------------------------------------|---------|----------|---------|-------|
| ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)                | ![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF6B35?logo=tanstack&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white) | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css&logoColor=white) | ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white) |
| ![React Compiler](https://img.shields.io/badge/React-Compiler-61DAFB?logo=react&logoColor=white) | ![TanStack Router](https://img.shields.io/badge/TanStack-Router-FF6B35?logo=tanstack&logoColor=white) | ![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle&logoColor=black) | ![shadcn/ui](https://img.shields.io/badge/shadcn-ui-000000?logo=shadcnui&logoColor=white) | ![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white) |
| ![TanStack DB](https://img.shields.io/badge/TanStack-Db-FF6B35?logo=tanstack&logoColor=white)    | ![Better Auth](https://img.shields.io/badge/Better-Auth-4F46E5?logo=auth0&logoColor=white) | ![Electric SQL](https://img.shields.io/badge/Electric-SQL-FFD700?logo=postgresql&logoColor=black) | ![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-F56565?logo=lucide&logoColor=white) | ![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white) |

</div>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) or npm/yarn
- **PostgreSQL** database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/textsync.git
   cd textsync
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/textsync"
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Database setup**
   ```bash
   pnpm db push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   🎉 Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 📱 Usage

### Creating a Workspace
1. Click **"Create Workspace"** on the homepage
2. A new room is created with an initial message
3. Share the room ID or QR code with collaborators

### Managing Messages
- **Create**: Click the "+" button in the messages sidebar
- **Edit Title**: Double-click the message title or use the edit icon
- **Delete**: Click the trash icon and confirm deletion
- **Select**: Click any message to start editing its content

### Text Operations
- **Copy**: Use the "Copy Text" button to copy content to clipboard
- **Quick Format**: Use UPPER, lower, or Trim buttons for text formatting
- **Clear**: Remove all content from the current message

### Collaboration
- **Share Room**: Use the QR code or share the room URL
- **Real-time Sync**: All changes sync instantly across devices
- **Multi-user**: Multiple people can edit simultaneously

---

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── MessagesList.tsx # Messages sidebar component
│   ├── TextSyncArea.tsx # Main text editing area
│   └── ...
├── routes/              # TanStack Router pages
│   ├── index.tsx        # Homepage with workspace creation
│   └── text-sync/
│       └── $id.tsx      # Main workspace page
├── lib/                 # Utilities and configurations
│   ├── collection/      # Database collections
│   ├── db/             # Database schema and connection
│   └── auth/           # Authentication setup
├── serverFn/           # Server functions
│   ├── messages.ts     # Message CRUD operations
│   └── rooms.ts        # Room CRUD operations
└── ...
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm deploy` | Build and deploy to Cloudflare |
| `pnpm db` | Run Drizzle Kit commands |
| `pnpm ui` | Add shadcn/ui components |
| `pnpm check` | Run linting, formatting, and type checking |
| `pnpm deps` | Update dependencies interactively |

---

## 🌐 Deployment

### Cloudflare Workers (Recommended)

1. **Configure Wrangler**
   ```bash
   npx wrangler login
   ```

2. **Set up environment variables**
   ```bash
   npx wrangler secret put DATABASE_URL
   npx wrangler secret put BETTER_AUTH_SECRET
   ```

3. **Deploy**
   ```bash
   pnpm deploy
   ```

### Other Platforms

TextSync can be deployed to any platform that supports Node.js:
- **Vercel**: Zero-config deployment
- **Netlify**: Static site with serverless functions
- **Railway**: Full-stack deployment
- **Render**: Container-based deployment

See the [TanStack Start hosting docs](https://tanstack.com/start/latest/docs/framework/react/hosting) for detailed instructions.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   pnpm check
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Add TypeScript types for all new code
- Test your changes across different devices and browsers
- Update documentation for new features
- Ensure all tests pass before submitting

---

## 📄 License

This project is in the public domain via [Unlicense](LICENSE). Feel free to use, modify, and distribute as you see fit.

---

## 🙏 Acknowledgments

- **TanStack Team** - For the amazing router and query libraries
- **shadcn** - For the beautiful UI component system
- **Electric SQL** - For real-time database synchronization
- **Tailwind CSS** - For the utility-first CSS framework
- **React Team** - For React 19 and the new compiler

---

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/textsync/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/yourusername/textsync/discussions)

---

