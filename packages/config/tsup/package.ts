import { createBaseConfig } from './base'

// 套件專用配置
export const packageConfig = createBaseConfig({
  entry: ['src/index.ts'],
  dts: false, // 使用 tsc 生成型別檔案
})