import { siteConfig } from '@/config/site';

interface CopyrightProps {
  className?: string;
}

export function Copyright({ className }: CopyrightProps): React.ReactElement {
  return (
    <p className={className}>
      © {siteConfig.copyrightYear} {siteConfig.companyName}. All rights reserved.
    </p>
  );
}
