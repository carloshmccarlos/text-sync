import { cloudflare } from "@cloudflare/vite-plugin";
import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		tsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),

		netlify(),
		tanstackStart(),
		viteReact(),
	],
});
