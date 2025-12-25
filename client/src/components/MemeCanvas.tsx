import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface MemeCanvasProps {
  imageSrc: string | null;
  topText: string;
  bottomText: string;
  width?: number;
  height?: number;
}

export interface MemeCanvasHandle {
  getDataUrl: () => string | null;
}

const MemeCanvas = forwardRef<MemeCanvasHandle, MemeCanvasProps>(
  ({ imageSrc, topText, bottomText, width = 600, height = 600 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    useImperativeHandle(ref, () => ({
      getDataUrl: () => {
        return canvasRef.current?.toDataURL("image/jpeg", 0.9) || null;
      },
    }));

    useEffect(() => {
      if (!imageSrc) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      img.onload = () => {
        imgRef.current = img;
        draw();
      };
    }, [imageSrc]);

    useEffect(() => {
      if (imgRef.current) {
        draw();
      }
    }, [topText, bottomText, width, height]);

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const img = imgRef.current;

      if (!canvas || !ctx || !img) return;

      const aspectRatio = img.naturalHeight / img.naturalWidth;
      const canvasWidth = width;
      const canvasHeight = width * aspectRatio;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw Image
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // Configure Text Style
      const fontSize = canvasWidth * 0.05; // Smaller font for the "snapchat-style" bar
      ctx.font = `600 ${fontSize}px sans-serif`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const barHeight = fontSize * 1.8;
      const barPadding = fontSize * 0.2;

      // Draw Top Bar (Centered horizontally, but stacked in the middle vertically)
      if (topText) {
        const topY = canvasHeight / 2 - barHeight / 2 - barPadding;
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, topY - barHeight / 2, canvasWidth, barHeight);
        
        ctx.fillStyle = "white";
        ctx.fillText(topText, canvasWidth / 2, topY);
      }

      // Draw Bottom Bar
      if (bottomText) {
        const bottomY = canvasHeight / 2 + barHeight / 2 + barPadding;
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, bottomY - barHeight / 2, canvasWidth, barHeight);
        
        ctx.fillStyle = "white";
        ctx.fillText(bottomText, canvasWidth / 2, bottomY);
      }
    };

    const drawText = (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number
    ) => {
      const words = text.toUpperCase().split(" ");
      let line = "";
      const lines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      // Adjust Y for bottom text multiline
      if (ctx.textBaseline === "bottom") {
         y -= (lines.length - 1) * lineHeight;
      }

      for (let i = 0; i < lines.length; i++) {
        ctx.strokeText(lines[i], x, y + i * lineHeight);
        ctx.fillText(lines[i], x, y + i * lineHeight);
      }
    };

    return (
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded-lg shadow-inner bg-muted mx-auto"
        style={{ maxHeight: '60vh' }}
      />
    );
  }
);

MemeCanvas.displayName = "MemeCanvas";

export default MemeCanvas;
