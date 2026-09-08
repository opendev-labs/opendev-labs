import React, { useState, useRef, useEffect } from 'react';

interface MiniDesktopPreviewProps {
  url: string;
  title: string;
  fallbackImg?: string;
  virtualWidth?: number;
}

export const MiniDesktopPreview: React.FC<MiniDesktopPreviewProps> = ({
  url,
  title,
  fallbackImg,
  virtualWidth = 1280,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.28);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const width = container.clientWidth;
      if (width > 0) {
        setScale(width / virtualWidth);
      }
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [virtualWidth]);

  // Aspect ratio 16:10 -> height = virtualWidth * (10 / 16) = virtualWidth * 0.625
  const virtualHeight = Math.round(virtualWidth * 0.625);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-950 flex items-center justify-center select-none"
    >
      {/* Live Scaled Mini-Desktop Iframe Preview */}
      <iframe
        src={url}
        title={title}
        sandbox="allow-scripts allow-same-origin allow-forms"
        scrolling="no"
        className="absolute top-0 left-0 pointer-events-none border-0 opacity-95 group-hover:opacity-100 transition-opacity z-10"
        style={{
          width: `${virtualWidth}px`,
          height: `${virtualHeight}px`,
          minWidth: `${virtualWidth}px`,
          minHeight: `${virtualHeight}px`,
          maxWidth: `${virtualWidth}px`,
          maxHeight: `${virtualHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        loading="lazy"
      />

      {/* High-Definition Miniature Screen Preview Image Fallback */}
      {fallbackImg && (
        <img
          src={fallbackImg}
          alt={title}
          className="w-full h-full object-cover object-top absolute inset-0 z-0"
        />
      )}
    </div>
  );
};
