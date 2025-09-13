import { defineConfig, type Options } from 'tsup'

export const createBaseConfig = (options: Partial<Options> = {}): Options => {
  return defineConfig({
    // 基礎設定
    format: ['esm'],
    target: 'es2022',
    clean: true,
    sourcemap: true,
    skipNodeModulesBundle: true,

    // 預設不包含的外部套件
    external: [
      'mongodb',
      'redis',
      'prisma',
      '@prisma/client'
    ],

    // 合併用戶自定義選項
    ...options
  })
}

export const baseConfig = createBaseConfig()