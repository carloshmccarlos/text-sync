import React, { useEffect, useRef } from "react";

export type QRCodeProps = {
  value: string;
  size?: number;
  colorDark?: string;
  colorLight?: string;
  className?: string;
};

// Canvas-based QR code component using the 'qrcode' package via dynamic import
export default function QRCodeCanvas({
  value,
  size = 144,
  colorDark = "#6D28D9", // purple-700
  colorLight = "#FFFFFF00", // transparent
  className,
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const render = async () => {
      if (!canvasRef.current || !value) return;
      try {
        const QRCode = await import("qrcode");
        if (!isMounted) return;
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 1,
          color: {
            dark: colorDark,
            light: colorLight,
          },
        });
      } catch (err) {
        console.error("Failed to render QR:", err);
      }
    };
    void render();
    return () => {
      isMounted = false;
    };
  }, [value, size, colorDark, colorLight]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="QR code"
      role="img"
    />
  );
}
