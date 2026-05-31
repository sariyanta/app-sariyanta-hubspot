declare module '*.module.css';

// Ambient type for HubSpot CMS React island imports (`import X from './X?island'`).
// The `?island` loader (provided by HubSpot's build / dev server) turns a module
// into a lazy, hydratable island descriptor consumed by the `<Island>` component.
// Note: go-to-definition on these imports lands here, not the real .tsx — the
// `?island` query is a virtual module TS can't resolve to a file. Expected.
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*?island' {
  import type { ComponentType } from 'react';

  const lazyComponent: {
    (): Promise<{ default: ComponentType<any> }>;
    moduleName: string;
    moduleId: string;
  };
  export default lazyComponent;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}
