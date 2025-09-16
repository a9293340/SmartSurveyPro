/**
 * 密碼加密和驗證工具 - 模板版本
 * 使用 bcrypt 進行密碼雜湊處理
 */

/**
 * 加密密碼
 * TODO(human): 實作密碼加密邏輯
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  // TODO(human): 實作密碼加密
  // 學習重點：
  // - bcrypt.hash() 的使用方法
  // - saltRounds 的選擇（推薦 12）
  // - 非同步操作的錯誤處理

  throw new Error('hashPassword 尚未實作');
}

/**
 * 驗證密碼
 * TODO(human): 實作密碼驗證邏輯
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  // TODO(human): 實作密碼驗證
  // 學習重點：
  // - bcrypt.compare() 的工作原理
  // - 為什麼不能直接比對 hash 值
  // - 錯誤處理和安全性考量

  throw new Error('verifyPassword 尚未實作');
}

/**
 * 密碼強度驗證
 * TODO(human): 實作密碼強度檢查邏輯
 */
export interface PasswordStrengthResult {
  isValid: boolean;
  score: number; // 0-4
  feedback: string[];
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  // TODO(human): 實作密碼強度檢查
  // 學習重點：
  // - 密碼複雜度規則設計
  // - 正則表達式的應用
  // - 常見密碼的檢查機制
  // - 用戶友好的反饋設計

  // 提示：檢查項目包括
  // - 最小長度（8 字元）
  // - 大小寫字母
  // - 數字
  // - 特殊字符
  // - 常見密碼過濾

  throw new Error('validatePasswordStrength 尚未實作');
}
