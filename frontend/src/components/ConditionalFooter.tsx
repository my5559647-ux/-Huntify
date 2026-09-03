'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

const NO_FOOTER_PATHS = ['/messages', '/ai-features'];

export default function ConditionalFooter() {
  const pathname = usePathname();
  const shouldShowFooter = !NO_FOOTER_PATHS.includes(pathname);

  if (!shouldShowFooter) {
    return null;
  }

  return <Footer />;
}
