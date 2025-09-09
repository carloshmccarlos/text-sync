import { cleanupExpiredRooms } from "./cron/cleanupRooms";

// This is the main worker entry point that handles both HTTP requests and scheduled events
export default {
	// Handle scheduled cron events
	async scheduled(event: any, env: any, ctx: any) {
		console.log('Cron trigger fired:', new Date().toISOString());
		
		// Use waitUntil to ensure the cleanup completes before the worker terminates
		ctx.waitUntil(cleanupExpiredRooms());
	},

	// Handle HTTP requests (this will be handled by the main TanStack Start app)
	async fetch(request: Request, env: any, ctx: any) {
		// Import the main app handler dynamically to avoid circular dependencies
		const { default: handler } = await import('../.output/server/index.mjs');
		return handler.fetch(request, env, ctx);
	}
};
