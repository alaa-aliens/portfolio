import { defineConfig } from 'vite'
import path from 'path'
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

// `vite build --mode preview` makes one self-contained HTML file (used for the Claude preview link).
export default defineConfig(({ mode }) => ({
  plugins: [
    figmaAssets(),
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
