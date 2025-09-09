import { createServerFileRoute } from "@tanstack/react-start/server";

// 1x1 transparent PNG placeholder. Replace with a real 180x180 PNG in public/icons to remove this route.
const PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+8NTkAAAAASUVORK5CYII=";

const serve = async () => {
  const bytes = Uint8Array.from(globalThis.atob(PNG_BASE64), (c) => c.charCodeAt(0));
  return new Response(bytes, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=86400",
    },
  });
};

export const ServerRoute = createServerFileRoute("/icons/apple-touch-icon/png").methods({
  GET: serve,
});

