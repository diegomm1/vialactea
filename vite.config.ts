import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    watch: {
      ignored: ['**/PORTABLE_USB_VIA_LACTEA/**', '**/dist/**']
    }
  }
});
