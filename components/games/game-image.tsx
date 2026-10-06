"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type GameImageProps = {
  src: string;
  width: number;
  height: number;
  sizes: string;
  eager: boolean;
};

function ImageFallback() {
  return (
    <div
      role="img"
      aria-label="تصویر بازی در دسترس نیست"
      className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-muted text-muted"
    >
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M6 9h12a3 3 0 0 1 3 3.2l-.6 5A2.4 2.4 0 0 1 16 18l-1-2H9l-1 2a2.4 2.4 0 0 1-4.4-.8l-.6-5A3 3 0 0 1 6 9Z" strokeLinejoin="round" />
        <path d="M8 12v3M6.5 13.5h3M16 12.5h.01M18 14.5h.01" strokeLinecap="round" />
      </svg>
      <span className="text-xs">تصویر در دسترس نیست</span>
    </div>
  );
}

/**
 * Swaps in a same-sized placeholder when the image fails. The ref callback
 * also catches images that failed before React attached `onError`, which
 * happens with server-rendered markup.
 */
export function GameImage({ src, width, height, sizes, eager }: GameImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const checkAlreadyFailed = useCallback(
    (image: HTMLImageElement | null) => {
      if (image && image.complete && image.naturalWidth === 0) {
        setFailedSrc(src);
      }
    },
    [src],
  );

  if (failedSrc === src) return <ImageFallback />;

  return (
    <Image
      ref={checkAlreadyFailed}
      src={src}
      alt=""
      width={width}
      height={height}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      onError={() => setFailedSrc(src)}
      className="h-full w-full object-cover"
    />
  );
}
