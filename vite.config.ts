import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Figma Make serves images as `figma:asset/<hash>.png`; locally they live in src/assets/.
function figmaAssets() {
  return {
    name: 'figma-assets',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        return path.resolve(__dirname, 'src/assets', id.slice('figma:asset/'.length))
      }
      return null
    },
  }
}

// On the live build, unpublished blog posts (draft: true) are replaced by an empty
// stub so their text never ships in the site's code.
function stripDraftPosts(mode: string) {
  return {
    name: 'strip-draft-posts',
    enforce: 'pre' as const,
    transform(_code: string, id: string) {
      if (mode !== 'production' || !id.includes('/content/blog/')) return null
      const file = id.split('?')[0]
      if (!file.endsWith('.md')) return null
      const head = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
      return /^draft:\s*true\s*$/m.test(head) ? 'export default "---\\ndraft: true\\n---\\n"' : null
    },
  }
}

// `vite build --mode preview` makes one self-contained HTML file (used for the Claude preview link).
export default defineConfig(({ mode }) => ({
  plugins: [
    figmaAssets(),
    stripDraftPosts(mode),
    ...(mode === 'preview' ? [viteSingleFile()] : []),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  ...(mode === 'preview' ? { build: { outDir: 'dist-preview', assetsInlineLimit: 100_000_000 } } : {}),
  // `vite build --mode v2` = the hidden work-in-progress site served at alaa-ali.com/v2/
  ...(mode === 'v2' ? { base: '/v2/', build: { outDir: 'dist-v2' } } : {}),
}))
