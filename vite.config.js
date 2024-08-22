import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createSitemapPlugin } from 'vite-plugin-sitemap';

export default defineConfig({
    plugins: [
        react(),
        createSitemapPlugin({
            hostname: 'https://studentsenior.com',
            outDir: 'dist',
            dynamicRoutes: [
                '/college/:collegeName',
                '/college/:collegeName/seniors',
                '/college/:collegeName/pyq',
                '/college/:collegeName/store',
                '/college/:collegeName/community',
                '/college/:collegeName/whatsapp-group',
                '/college/:collegeName/opportunities',
                '/college/:collegeName/notes',
            ],
        }),
    ],
});
