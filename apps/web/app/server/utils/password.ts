/**
 * 密碼加密和驗證工具 - 模板版本
 * 使用 bcrypt 進行密碼雜湊處理
 */
import bcrypt from 'bcrypt';

/**
 * 加密密碼
 * @param plainPassword - 明文密碼
 * @returns 加密後的密碼
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  try {
    // 簡單驗證：信任 TypeScript，只檢查空值
    if (!plainPassword) {
      throw new Error('密碼不能為空');
    }

    // saltRounds = 12: 平衡安全性與效能
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('密碼加密失敗:', error);
    throw new Error('密碼加密處理失敗');
  }
}

/**
 * 驗證密碼
 * @param plainPassword - 明文密碼
 * @param hashedPassword - 加密後的密碼
 * @returns 是否驗證成功
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    if (!plainPassword || !hashedPassword) {
      return false; // 安全考量：直接返回 false
    }

    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    console.error('密碼驗證失敗:', error);
    // 安全考量：驗證失敗時返回 false，不暴露具體錯誤
    return false;
  }
}

/**
 * 密碼強度驗證
 * @param password - 密碼
 * @returns 密碼強度結果
 * @interface PasswordStrengthResult
 * @property isValid - 是否有效
 * @property score - 得分
 * @property feedback - 回饋
 */
export interface PasswordStrengthResult {
  isValid: boolean;
  score: number; // 0-4
  feedback: string[];
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return {
      isValid: false,
      score: 0,
      feedback: ['密碼不能為空'],
    };
  }

  // 1. 長度檢查（基礎要求）
  if (password.length < 8) {
    return {
      isValid: false,
      score: 0,
      feedback: ['密碼長度至少需要 8 個字元'],
    };
  }
  if (password.length >= 8) score++;
  if (password.length >= 12) score++; // 長密碼加分

  // 2. 字符類型檢查
  if (!/[a-z]/.test(password)) {
    feedback.push('建議包含小寫字母');
  } else {
    score++;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('建議包含大寫字母');
  } else {
    score++;
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('建議包含數字');
  } else {
    score++;
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    feedback.push('建議包含特殊字符');
  } else {
    score++;
  }

  // 3. 常見密碼檢查
  const commonPasswords = [
    '12345678',
    'password',
    'Password123',
    '11111111',
    'qwerty123',
    'abc123456',
    '123456789',
    'password123',
    'admin123',
    'welcome123',
  ];

  if (commonPasswords.some(common => password.toLowerCase().includes(common.toLowerCase()))) {
    feedback.push('避免使用常見密碼');
    score = Math.max(0, score - 2);
  }

  // 4. 重複字符檢查
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('避免連續重複字符');
    score--;
  }

  // 5. 判定結果
  const isValid = score >= 4 && password.length >= 8;

  if (isValid && feedback.length === 0) {
    feedback.push('密碼強度良好');
  }

  return {
    isValid,
    score: Math.max(0, Math.min(5, score)), // 限制在 0-5
    feedback,
  };
}
