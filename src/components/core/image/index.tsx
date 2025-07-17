'use client';

import { cn } from "@/utils/cn";
import NextImage, { StaticImageData } from "next/image";
import { memo, useCallback, useState } from "react";
import './index.scss';

const FALLBACK_IMAGE = '/assets/common/empty.webp';

interface ImageProps {
  src: string | StaticImageData;
  mobileSrc?: string | StaticImageData;
  basePath?: string;
  className?: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  fetchPriority?: "high" | "low" | "auto";
  fill?: boolean;
}

const Image = memo(({
  src,
  mobileSrc,
  basePath = "",
  className = "",
  alt = "image",
  fetchPriority = "auto",
  width,
  height,
  priority = false,
  quality = 100,
  fill = false,
}: ImageProps) => {
  const resolvedDesktopSrc =
    typeof src === 'string' ? basePath + (src || FALLBACK_IMAGE) : src;

  const resolvedMobileSrc =
    typeof mobileSrc === 'string' ? basePath + (mobileSrc || FALLBACK_IMAGE) : mobileSrc ?? null;

  const [imageState, setImageState] = useState({
    desktopSrc: resolvedDesktopSrc,
    mobileSrc: resolvedMobileSrc,
    isLoaded: false,
  });


  const handleLoad = useCallback(() => {
    setImageState((prev) => ({ ...prev, isLoaded: true }));
  }, []);

  const handleError = useCallback(
    (type: 'desktop' | 'mobile') => {
      setImageState((prev) => {
        if (type === 'desktop' && prev.desktopSrc !== FALLBACK_IMAGE) {
          return { ...prev, desktopSrc: basePath + FALLBACK_IMAGE, isLoaded: false };
        }
        if (type === 'mobile' && prev.mobileSrc && prev.mobileSrc !== FALLBACK_IMAGE) {
          return { ...prev, mobileSrc: basePath + FALLBACK_IMAGE, isLoaded: false };
        }
        return prev;
      });
    },
    [basePath]
  );

  const commonProps = {
    className: "core-image",
    alt,
    width: fill ? 100 : width,
    height: fill ? 100 : height,
    priority,
    fetchPriority,
    loading: priority ? ("eager" as "eager" | "lazy") : ("lazy" as "eager" | "lazy"),
    onLoad: handleLoad,
    quality,
    // sizes: fill ? sizes : undefined,
    fill,
  };

  return (
    <div className={cn("core-image__wrapper core-img-loader", className, imageState.isLoaded ? 'is-loaded' : '')}>
      {imageState.mobileSrc ? (
        <picture>
          <source
            media="(max-width: 1024px)"
            srcSet={typeof imageState.mobileSrc === 'string' ? imageState.mobileSrc : imageState.mobileSrc.src}
            onError={() => handleError('mobile')}
          />
          <NextImage
            src={imageState.desktopSrc}
            onError={() => handleError('desktop')}
            {...commonProps}
          />
        </picture>
      ) : (
        <NextImage
          src={imageState.desktopSrc}
          onError={() => handleError('desktop')}
          {...commonProps}
        />
      )}
    </div>
  );
});

Image.displayName = 'Image';

export default Image;