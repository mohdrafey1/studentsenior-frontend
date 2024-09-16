import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import SitemapPlugin from 'vite-plugin-sitemap';
import { VitePWA } from 'vite-plugin-pwa';

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
            generateRobotsTxt: false,
        }),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Student Senior',
                short_name: 'Student Senior',
                description: 'Your College Resource on One Click',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#000000',
                icons: [
                    {
                        src: '/assets/image192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/assets/image512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
                screenshots: [
                    {
                        src: '/assets/ss360.png',
                        sizes: '360x640',
                        type: 'image/png',
                        label: 'Screenshot of app in action',
                    },
                    {
                        src: '/assets/ss1280.png',
                        sizes: '1280x800',
                        type: 'image/png',
                        label: 'Wide screenshot',
                    },
                ],
            },
        }),
    ],
});
