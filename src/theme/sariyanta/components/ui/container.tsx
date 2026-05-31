import * as React from 'react';

import { cn } from '@/lib/utils';

/*
 * Shared page container: owns the centering, gutter, and width ramp so the
 * blog pages stay aligned. Inner layout (grids, sidebars) is composed by the
 * consumer via `className` and children.
 */
const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mx-auto w-full max-w-2xl px-4 sm:px-6 xl:max-w-5xl',
      className,
    )}
    {...props}
  />
));
Container.displayName = 'Container';

export { Container };
