import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { env } from "~/env/server";

// Electric Cloud Shape URL from env, e.g. https://your-app.electric-sql.com/v1/shape
const baseUrl = env.ELECTRIC_SHAPE_URL;

const serve = async ({ request }: { request: Request }) => {
	// ...check user authorization
	const url = new URL(request.url);
	const originUrl = new URL(baseUrl);

	// Passthrough required Electric protocol params
	url.searchParams.forEach((value, key) => {
		if (ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
			originUrl.searchParams.set(key, value);
		}
	});

	// Shape parameters for messages
	// full spec: https://github.com/electric-sql/electric/blob/main/website/electric-api.yaml
	originUrl.searchParams.set("table", "messages");

	// Scope rows by roomId if provided by the client
	const roomId = url.searchParams.get("roomId") ?? "";
	// Optional: enforce expected format for your 6-char room IDs
	if (/^[A-Z0-9]{6}$/.test(roomId)) {
		originUrl.searchParams.set("where", `room_id = '${roomId}'`);
	}

	// Optionally select columns
	originUrl.searchParams.set(
		"columns",
		"id,room_id,title,content,created_at,updated_at",
	);

	// Electric Cloud requires a source_id query param
	if (env.ELECTRIC_SQL_CLOUD_SOURCE_ID) {
		originUrl.searchParams.set("source_id", env.ELECTRIC_SQL_CLOUD_SOURCE_ID);
	} else {
		return new Response(
			JSON.stringify({ error: "Missing ELECTRIC_SQL_CLOUD_SOURCE_ID" }),
			{ status: 500, headers: { "content-type": "application/json" } },
		);
	}

	// Electric Cloud can require the secret as a query parameter
	if (env.ELECTRIC_SQL_CLOUD_SOURCE_SECRET) {
		originUrl.searchParams.set("secret", env.ELECTRIC_SQL_CLOUD_SOURCE_SECRET);
	} else {
		return new Response(
			JSON.stringify({ error: "Missing ELECTRIC_SQL_CLOUD_SOURCE_SECRET" }),
			{ status: 500, headers: { "content-type": "application/json" } },
		);
	}

	// Add Authorization header if we have a Cloud Source secret
	const elecHeaders: Record<string, string> = {};
	if (env.ELECTRIC_SQL_CLOUD_SOURCE_SECRET) {
		elecHeaders["Authorization"] =
			`Bearer ${env.ELECTRIC_SQL_CLOUD_SOURCE_SECRET}`;
	}

	const response = await fetch(originUrl, { headers: elecHeaders });
	const headers = new Headers(response.headers);
	headers.delete("content-encoding");
	headers.delete("content-length");

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
};

export const ServerRoute = createServerFileRoute("/api/messages").methods({
	GET: serve,
});
