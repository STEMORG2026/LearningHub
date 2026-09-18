import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const toPath = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: toPath('index.html'),
        stemma: toPath('stemma.html'),
        lab: toPath('lab.html'),
        game: toPath('game.html'),
        tuition: toPath('tuition.html'),
        professorJ: toPath('professor-j.html'),
        classes: toPath('classes.html'),
        videos: toPath('videos.html'),
        contact: toPath('contact.html'),
        about: toPath('about.html'),
        learn: toPath('learn.html'),
      },
    },
  },
});
