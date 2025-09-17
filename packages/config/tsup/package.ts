import { createBaseConfig } from './base';

// 套件專用配置
export const packageConfig = createBaseConfig({
  entry: ['src/index.ts'],
  dts: true, // 啟用 TypeScript 類型定義生成
  format: ['esm'],
  sourcemap: true,
});
