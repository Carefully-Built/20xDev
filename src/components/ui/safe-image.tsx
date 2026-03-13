'use client';

import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackClassName?: string;
}

export function SafeImage({
  src,
  alt,
  width = 32,
  height = 32,
  className,
  fallbackClassName,
}: SafeImageProps): React.ReactElement {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted/50 text-muted-foreground',
          fallbackClassName ?? className
        )}
        style={{ width, height }}
        title={`Failed to load: ${alt}`}
      >
        <AlertCircle className="size-4" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('rounded-md object-contain', className)}
      onError={() => setHasError(true)}
    />
  );
}
