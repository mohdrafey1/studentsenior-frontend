// vite.config.js
import { defineConfig } from "file:///I:/studentsenior-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///I:/studentsenior-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import SitemapPlugin from "file:///I:/studentsenior-frontend/node_modules/vite-plugin-sitemap/dist/index.js";
import { VitePWA } from "file:///I:/studentsenior-frontend/node_modules/vite-plugin-pwa/dist/index.js";
var colleges = ["integral-university", "mpec-kanpur"];
var collegePages = [
  "",
  "/pyq",
  "/seniors",
  "/resources",
  "/whatsapp-group",
  "/store",
  "/community",
  "/opportunities"
];
var staticRoutes = [
  "/",
  "/becomesenior",
  "/about-us",
  "/contact-us",
  "/privacy-policy",
  "/sign-in",
  "/sign-up",
  "/install",
  "/integral-university/resources/cse",
  "/integral-university/resources/cse/btech-cse?semester=1"
];
var dynamicRoutes = colleges.flatMap(
  (college) => collegePages.map((page) => `/college/${college}${page}`)
);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    SitemapPlugin({
      hostname: "https://studentsenior.com",
      outDir: "dist",
      dynamicRoutes: [...staticRoutes, ...dynamicRoutes],
      generateRobotsTxt: false
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
      },
      manifest: {
        name: "Student Senior",
        short_name: "Student Senior",
        description: "Your College Resource on One Click",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/assets/image192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/assets/image512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        screenshots: [
          {
            src: "/assets/ss360.png",
            sizes: "360x640",
            type: "image/png",
            label: "Screenshot of app in action"
          },
          {
            src: "/assets/ss1280.png",
            sizes: "1280x800",
            type: "image/png",
            label: "Wide screenshot"
          }
        ]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJJOlxcXFxzdHVkZW50c2VuaW9yLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJJOlxcXFxzdHVkZW50c2VuaW9yLWZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9JOi9zdHVkZW50c2VuaW9yLWZyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBTaXRlbWFwUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLXNpdGVtYXAnO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcclxuXHJcbmNvbnN0IGNvbGxlZ2VzID0gWydpbnRlZ3JhbC11bml2ZXJzaXR5JywgJ21wZWMta2FucHVyJ107XHJcbmNvbnN0IGNvbGxlZ2VQYWdlcyA9IFtcclxuICAgICcnLFxyXG4gICAgJy9weXEnLFxyXG4gICAgJy9zZW5pb3JzJyxcclxuICAgICcvcmVzb3VyY2VzJyxcclxuICAgICcvd2hhdHNhcHAtZ3JvdXAnLFxyXG4gICAgJy9zdG9yZScsXHJcbiAgICAnL2NvbW11bml0eScsXHJcbiAgICAnL29wcG9ydHVuaXRpZXMnLFxyXG5dO1xyXG5cclxuY29uc3Qgc3RhdGljUm91dGVzID0gW1xyXG4gICAgJy8nLFxyXG4gICAgJy9iZWNvbWVzZW5pb3InLFxyXG4gICAgJy9hYm91dC11cycsXHJcbiAgICAnL2NvbnRhY3QtdXMnLFxyXG4gICAgJy9wcml2YWN5LXBvbGljeScsXHJcbiAgICAnL3NpZ24taW4nLFxyXG4gICAgJy9zaWduLXVwJyxcclxuICAgICcvaW5zdGFsbCcsXHJcbiAgICAnL2ludGVncmFsLXVuaXZlcnNpdHkvcmVzb3VyY2VzL2NzZScsXHJcbiAgICAnL2ludGVncmFsLXVuaXZlcnNpdHkvcmVzb3VyY2VzL2NzZS9idGVjaC1jc2U/c2VtZXN0ZXI9MScsXHJcbl07XHJcblxyXG5jb25zdCBkeW5hbWljUm91dGVzID0gY29sbGVnZXMuZmxhdE1hcCgoY29sbGVnZSkgPT5cclxuICAgIGNvbGxlZ2VQYWdlcy5tYXAoKHBhZ2UpID0+IGAvY29sbGVnZS8ke2NvbGxlZ2V9JHtwYWdlfWApXHJcbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIHJlYWN0KCksXHJcbiAgICAgICAgU2l0ZW1hcFBsdWdpbih7XHJcbiAgICAgICAgICAgIGhvc3RuYW1lOiAnaHR0cHM6Ly9zdHVkZW50c2VuaW9yLmNvbScsXHJcbiAgICAgICAgICAgIG91dERpcjogJ2Rpc3QnLFxyXG4gICAgICAgICAgICBkeW5hbWljUm91dGVzOiBbLi4uc3RhdGljUm91dGVzLCAuLi5keW5hbWljUm91dGVzXSxcclxuICAgICAgICAgICAgZ2VuZXJhdGVSb2JvdHNUeHQ6IGZhbHNlLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIFZpdGVQV0Eoe1xyXG4gICAgICAgICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcclxuICAgICAgICAgICAgd29ya2JveDoge1xyXG4gICAgICAgICAgICAgICAgY2xlYW51cE91dGRhdGVkQ2FjaGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDQgKiAxMDI0ICogMTAyNCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWFuaWZlc3Q6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdTdHVkZW50IFNlbmlvcicsXHJcbiAgICAgICAgICAgICAgICBzaG9ydF9uYW1lOiAnU3R1ZGVudCBTZW5pb3InLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdZb3VyIENvbGxlZ2UgUmVzb3VyY2Ugb24gT25lIENsaWNrJyxcclxuICAgICAgICAgICAgICAgIHN0YXJ0X3VybDogJy8nLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAgICAgdGhlbWVfY29sb3I6ICcjMDAwMDAwJyxcclxuICAgICAgICAgICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6ICcvYXNzZXRzL2ltYWdlMTkyLnBuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6ICcvYXNzZXRzL2ltYWdlNTEyLnBuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgc2NyZWVuc2hvdHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogJy9hc3NldHMvc3MzNjAucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZXM6ICczNjB4NjQwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnU2NyZWVuc2hvdCBvZiBhcHAgaW4gYWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiAnL2Fzc2V0cy9zczEyODAucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZXM6ICcxMjgweDgwMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ1dpZGUgc2NyZWVuc2hvdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSksXHJcbiAgICBdLFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUSxTQUFTLG9CQUFvQjtBQUM5UixPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyxlQUFlO0FBRXhCLElBQU0sV0FBVyxDQUFDLHVCQUF1QixhQUFhO0FBQ3RELElBQU0sZUFBZTtBQUFBLEVBQ2pCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNKO0FBRUEsSUFBTSxlQUFlO0FBQUEsRUFDakI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDSjtBQUVBLElBQU0sZ0JBQWdCLFNBQVM7QUFBQSxFQUFRLENBQUMsWUFDcEMsYUFBYSxJQUFJLENBQUMsU0FBUyxZQUFZLE9BQU8sR0FBRyxJQUFJLEVBQUU7QUFDM0Q7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixRQUFRO0FBQUEsTUFDUixlQUFlLENBQUMsR0FBRyxjQUFjLEdBQUcsYUFBYTtBQUFBLE1BQ2pELG1CQUFtQjtBQUFBLElBQ3ZCLENBQUM7QUFBQSxJQUNELFFBQVE7QUFBQSxNQUNKLGNBQWM7QUFBQSxNQUNkLFNBQVM7QUFBQSxRQUNMLHVCQUF1QjtBQUFBLFFBQ3ZCLCtCQUErQixJQUFJLE9BQU87QUFBQSxNQUM5QztBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsV0FBVztBQUFBLFFBQ1gsU0FBUztBQUFBLFFBQ1Qsa0JBQWtCO0FBQUEsUUFDbEIsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ0g7QUFBQSxZQUNJLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFlBQ0ksS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1Y7QUFBQSxRQUNKO0FBQUEsUUFDQSxhQUFhO0FBQUEsVUFDVDtBQUFBLFlBQ0ksS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sT0FBTztBQUFBLFVBQ1g7QUFBQSxVQUNBO0FBQUEsWUFDSSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixPQUFPO0FBQUEsVUFDWDtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSixDQUFDO0FBQUEsRUFDTDtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
