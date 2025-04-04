import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import SitemapPlugin from 'vite-plugin-sitemap';
import { VitePWA } from 'vite-plugin-pwa';

const colleges = ['integral-university', 'mpec-kanpur'];
const collegePages = [
    '',
    '/pyq',
    '/seniors',
    '/resources',
    '/whatsapp-group',
    '/store',
    '/community',
    '/opportunities',
];

const staticRoutes = [
    '/',
    '/becomesenior',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/sign-in',
    '/sign-up',
    '/install',
    '/integral-university/resources/cse',
    '/integral-university/resources/cse/btech-cse?semester=1',
];

const dynamicRoutes = colleges.flatMap((college) =>
    collegePages.map((page) => `/college/${college}${page}`)
);

export default defineConfig({
    plugins: [
        react(),
        SitemapPlugin({
            hostname: 'https://studentsenior.com',
            outDir: 'dist',
            dynamicRoutes: [...staticRoutes, ...dynamicRoutes],
            generateRobotsTxt: false,
        }),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                cleanupOutdatedCaches: true,
                maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
            },
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
