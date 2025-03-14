import { Spinner } from '@blankui/spinner';
import type React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Spinner />
      </body>
    </html>
  );
}
