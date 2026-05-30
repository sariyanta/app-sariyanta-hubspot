import path from 'path';
import url from 'url';

import { defineConfig } from 'vite';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname),
    },
  },
  server: {
    allowedHosts: ['.hslocal.net'],
  },
});
