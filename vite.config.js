import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import SitemapPlugin from 'vite-plugin-sitemap';

export default defineConfig({
    plugins: [
        react(),
        SitemapPlugin({
            hostname: 'https://studentsenior.com',
            outDir: 'dist',
            dynamicRoutes: [
                '/college/integral-university',
                '/college/integral-university/pyq',
                '/college/integral-university/seniors',
                '/college/integral-university/notes',
                '/college/integral-university/whatsappgroups',
                '/about-us',
            ],
            robots: [{ userAgent: '*', allow: '/' }], // Add this line to auto-generate robots.txt
        }),
    ],
});
