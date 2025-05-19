'use client';

import { PropsWithChildren, useEffect } from 'react';
import './i18n';

export function Providers({ children }: PropsWithChildren) {
  useEffect(() => {
    // Initialize i18n
    import('./i18n');
  }, []);

  return <>{children}</>;
} 