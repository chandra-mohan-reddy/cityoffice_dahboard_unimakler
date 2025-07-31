import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
  base: "https://saleslead.unimakler.com/",
//   base: '/',
  plugins: [
    react({
      fastRefresh: false
    })
  ]
});
