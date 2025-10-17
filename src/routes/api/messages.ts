import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client";

import { env } from "~/env/server";
import { createFileRoute } from "@tanstack/react-router";

const baseUrl = env.ELECTRIC_SHAPE_URL;

export const Route = createFileRoute("/api/messages")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const originUrl = new URL(baseUrl);

        // Passthrough required Electric protocol params
        url.searchParams.forEach((value, key) => {
          if (ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
            originUrl.searchParams.set(key, value);
          }
        });

        // Shape parameters for messages
        originUrl.searchParams.set("table", "messages");

        // Scope rows by roomId if provided by the client
        const roomId = url.searchParams.get("roomId") ?? "";
        if (/^[A-Z0-9]{6}$/.test(roomId)) {
          // Standard SQL syntax for Electric SQL
          originUrl.searchParams.set("where", `room_id='${roomId}'`);
        }

        originUrl.searchParams.set(
          "columns",
          "id,room_id,title,content,created_at,updated_at"
        );

        // Electric Cloud requires a source_id query param
        if (env.ELECTRIC_SQL_CLOUD_SOURCE_ID) {
          originUrl.searchParams.set(
            "source_id",
            env.ELECTRIC_SQL_CLOUD_SOURCE_ID
          );
        } else {
          return new Response(
            JSON.stringify({ error: "Missing ELECTRIC_SQL_CLOUD_SOURCE_ID" }),
            { status: 500, headers: { "content-type": "application/json" } }
          );
        }

        if (env.ELECTRIC_SQL_CLOUD_SOURCE_SECRET) {
          originUrl.searchParams.set(
            "secret",
            env.ELECTRIC_SQL_CLOUD_SOURCE_SECRET
          );
        } else {
          return new Response(
            JSON.stringify({
              error: "Missing ELECTRIC_SQL_CLOUD_SOURCE_SECRET",
            }),
            { status: 500, headers: { "content-type": "application/json" } }
          );
        }

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
      },
    },
  },
});
