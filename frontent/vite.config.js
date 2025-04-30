import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // opcional si quieres resolver explícitamente .jsx
    extensions: ['.js', '.jsx', '.json']
  }
});
