import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "async-css",
      transformIndexHtml(html, ctx) {
        if (ctx?.server) return html;

        const cssLinkRegex = /<link\s+rel="stylesheet"\s+([^>]*href="[^"]+\.css"[^>]*)>/g;

        return html.replace(cssLinkRegex, (match, attrs) => {
          const hrefMatch = attrs.match(/href="([^"]+)"/);
          if (!hrefMatch) return match;

          const safeAttrs = attrs.replace(/\s+rel="stylesheet"/g, "");
          const preloadTag = `<link rel="preload" as="style" ${safeAttrs} onload="this.onload=null;this.rel='stylesheet'">`;
          const noscriptTag = `<noscript><link rel="stylesheet" ${safeAttrs}></noscript>`;
          return `${preloadTag}${noscriptTag}`;
        });
      },
    },
    react(),
    tailwindcss(),
  ],
});
