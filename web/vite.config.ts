import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { NodePackageImporter } from 'sass';
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
  css: {
    preprocessorOptions: {
      scss: {
        importers: [new NodePackageImporter()],
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^@veams\/css-animations$/,
        replacement: path.resolve(workspaceRoot, 'packages/css-animations/src/index.ts'),
      },
      {
        find: '@veams/status-quo/react',
        replacement: path.resolve(workspaceRoot, 'packages/status-quo/src/react/index.ts'),
      },
      {
        find: '@veams/status-quo/store',
        replacement: path.resolve(workspaceRoot, 'packages/status-quo/src/store/index.ts'),
      },
      {
        find: '@veams/status-quo',
        replacement: path.resolve(workspaceRoot, 'packages/status-quo/src/index.ts'),
      },
      {
        find: '@veams/status-quo-query',
        replacement: path.resolve(workspaceRoot, 'packages/status-quo-query/src/index.ts'),
      },
      {
        find: '@veams/form/react',
        replacement: path.resolve(workspaceRoot, 'packages/form/src/react/index.ts'),
      },
      {
        find: '@veams/form/validators/zod',
        replacement: path.resolve(workspaceRoot, 'packages/form/src/validators/zod.ts'),
      },
      {
        find: '@veams/form',
        replacement: path.resolve(workspaceRoot, 'packages/form/src/index.ts'),
      },
    ],
  },
  plugins: [react(), spaFallbackPlugin()],
});
