import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'copy-extension-assets',
            closeBundle() {
                // Copy manifest and icon after build
                copyFileSync('src/extension/manifest.json', 'dist-extension/manifest.json');
                copyFileSync('src/extension/icon-128.png', 'dist-extension/icon-128.png');
                copyFileSync('src/extension/offscreen.html', 'dist-extension/offscreen.html');
                copyFileSync('src/extension/offscreen.js', 'dist-extension/offscreen.js');
                copyFileSync('src/extension/alarm.mp3', 'dist-extension/alarm.mp3');
            }
        }
    ],
    base: './',
    build: {
        outDir: 'dist-extension',
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/extension/popup.html'),
                sw: resolve(__dirname, 'src/extension/sw.ts')
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    return chunkInfo.name === "sw" ? 'sw.js' : 'assets/[name]-[hash].js'
                }
            }
        },
    },
})