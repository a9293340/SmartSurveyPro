import { createBaseConfig } from './base'

// Web 應用程式專用配置
export const webConfig = createBaseConfig({
  entry: ['app.ts', 'server/**/*.ts'],
  format: ['esm'],
  dts: false, // Nuxt3 有自己的型別生成機制
  splitting: true,
  treeshake: true,
})