import { createServerFn } from "@tanstack/react-start";
import { cleanupExpiredRooms } from "~/cron/cleanupRooms";

// Manual trigger for testing the cron job functionality
export const triggerRoomCleanup = createServerFn({ method: "POST" })
	.handler(async () => {
		console.log('Manual room cleanup triggered at:', new Date().toISOString());
		
		try {
			const result = await cleanupExpiredRooms();
			return {
				success: true,
				timestamp: new Date().toISOString(),
				...result
			};
		} catch (error) {
			console.error('Manual cleanup failed:', error);
			return {
				success: false,
				timestamp: new Date().toISOString(),
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	});

// Get statistics about rooms (for monitoring)
export const getRoomStats = createServerFn({ method: "GET" })
	.handler(async () => {
		const { db } = await import("~/lib/db");
		const { rooms } = await import("~/lib/db/schema/schema");
		const { count, sql } = await import("drizzle-orm");
		
		const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
		
		// Get total room count
		const totalRooms = await db.select({ count: count() }).from(rooms);
		
		// Get expired room count
		const expiredRooms = await db
			.select({ count: count() })
			.from(rooms)
			.where(sql`${rooms.createdAt} < ${twentyFourHoursAgo}`);
		
		return {
			totalRooms: totalRooms[0]?.count || 0,
			expiredRooms: expiredRooms[0]?.count || 0,
			timestamp: new Date().toISOString(),
			cutoffTime: twentyFourHoursAgo.toISOString()
		};
	});
