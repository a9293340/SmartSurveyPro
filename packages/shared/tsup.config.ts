import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm'],
  target: 'es2022',
  clean: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
  splitting: false, // 禁用代碼分割，避免 chunk 檔案
  dts: false, // 完全禁用 tsup 的 DTS 生成
  // 將 MongoDB 和其他 Node.js 專用模組標記為外部依賴
  external: ['mongodb', 'redis', 'crypto', 'util', 'fs', 'path'],
});
