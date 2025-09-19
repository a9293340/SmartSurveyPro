import { createBaseConfig } from '../config/tsup/base';

export default createBaseConfig({
  entry: {
    index: 'src/index.ts', // 客戶端安全的導出
    server: 'src/server.ts', // 伺服器端專用導出
  },
  dts: true,
  format: ['esm'],
  sourcemap: true,
  // 將 MongoDB 和其他 Node.js 專用模組標記為外部依賴
  external: ['mongodb', 'redis', 'crypto', 'util', 'fs', 'path'],
});
