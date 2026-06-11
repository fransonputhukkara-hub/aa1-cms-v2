import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    middlewareMode: false,
  },
  // Custom plugin to serve video files with range request support
  plugins: [
    react(),
    {
      name: 'video-range-support',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.match(/\.(mp4|webm|ogg)(\?.*)?$/)) return next();

          const filePath = path.join(process.cwd(), 'public', req.url.split('?')[0]);
          if (!fs.existsSync(filePath)) return next();

          const stat = fs.statSync(filePath);
          const fileSize = stat.size;
          const rangeHeader = req.headers['range'];

          if (rangeHeader) {
            const parts = rangeHeader.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = end - start + 1;

            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunkSize,
              'Content-Type': 'video/mp4',
            });
            fs.createReadStream(filePath, { start, end }).pipe(res);
          } else {
            res.writeHead(200, {
              'Content-Length': fileSize,
              'Content-Type': 'video/mp4',
              'Accept-Ranges': 'bytes',
            });
            fs.createReadStream(filePath).pipe(res);
          }
        });
      },
    },
  ],
});
