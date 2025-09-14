module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 提交類型
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修復 bug
        'docs',     // 文件變更
        'style',    // 格式（不影響程式碼運行的變更）
        'refactor', // 重構（既不是新增功能，也不是修復 bug）
        'perf',     // 效能優化
        'test',     // 測試相關
        'build',    // 建置系統或外部依賴的變更
        'ci',       // CI 配置變更
        'chore',    // 其他不修改 src 或 test 的變更
        'revert',   // 還原提交
      ],
    ],
    // 標題最大長度
    'header-max-length': [2, 'always', 100],
    // 標題最小長度
    'header-min-length': [2, 'always', 10],
    // 範圍可選
    'scope-empty': [0],
    // 主題不能為空
    'subject-empty': [2, 'never'],
    // 主題結尾不加句號
    'subject-full-stop': [2, 'never', '.'],
    // 主題小寫開頭
    'subject-case': [0],
  },
};