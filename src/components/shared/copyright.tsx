import { siteConfig } from '@/config/site';

interface CopyrightProps {
  className?: string;
}

export function Copyright({ className }: CopyrightProps) {
  return (
    <p className={className}>
      © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
    </p>
  );
}
