import { deleteExpiredRooms } from "~/serverFn/rooms";

export async function cleanupExpiredRooms() {
	try {
		console.log('Starting scheduled cleanup of expired rooms...');
		const result = await deleteExpiredRooms();
		
		if (result.deletedCount > 0) {
			console.log(`Successfully deleted ${result.deletedCount} expired rooms`);
		} else {
			console.log('No expired rooms found during cleanup');
		}
		
		return result;
	} catch (error) {
		console.error('Error during room cleanup:', error);
		throw error;
	}
}

// Export for Cloudflare Workers cron trigger
export default {
	async scheduled(event: any, env: any, ctx: any) {
		ctx.waitUntil(cleanupExpiredRooms());
	}
};
