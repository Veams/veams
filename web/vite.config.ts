import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const githubPagesBase = process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/';

function spaFallbackPlugin() {
  return {
    closeBundle() {
      const outDir = path.resolve(workspaceRoot, 'web/dist');
      const indexFile = path.join(outDir, 'index.html');
      const fallbackFile = path.join(outDir, '404.html');

      if (fs.existsSync(indexFile)) {
        fs.copyFileSync(indexFile, fallbackFile);
      }
    },
    name: 'veams-spa-fallback',
  };
}

export default defineConfig({
  base: githubPagesBase,
  plugins: [react(), spaFallbackPlugin()],
});
