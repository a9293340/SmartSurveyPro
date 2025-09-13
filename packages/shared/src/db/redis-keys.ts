// Redis Key 命名策略和管理

/**
 * SmartSurvey Pro Redis Key 命名規範
 *
 * 結構: SSP:{Service}:{Feature}:{Identifier}
 *
 * 服務分類:
 * - Web: Nuxt3 前端應用
 * - Server: 後端服務
 * - Auth: 認證服務
 * - Survey: 問卷服務
 * - Analytics: 分析服務
 *
 * 功能分類:
 * - Session: 用戶會話
 * - Cache: 快取資料
 * - Lock: 分散式鎖
 * - Queue: 任務佇列
 * - Rate: 限流控制
 */

const KEY_PREFIX = process.env.REDIS_KEY_PREFIX || 'SSP';
const KEY_SEPARATOR = ':';

export class RedisKeyBuilder {
  private parts: string[] = [KEY_PREFIX];

  constructor(service: string) {
    this.parts.push(service.toUpperCase());
  }

  feature(name: string): RedisKeyBuilder {
    this.parts.push(name.toLowerCase());
    return this;
  }

  id(identifier: string | number): RedisKeyBuilder {
    this.parts.push(String(identifier));
    return this;
  }

  build(): string {
    return this.parts.join(KEY_SEPARATOR);
  }

  // 靜態方法：常用 key 建構器
  static web() {
    return new RedisKeyBuilder('Web');
  }
  static server() {
    return new RedisKeyBuilder('Server');
  }
  static auth() {
    return new RedisKeyBuilder('Auth');
  }
  static survey() {
    return new RedisKeyBuilder('Survey');
  }
  static analytics() {
    return new RedisKeyBuilder('Analytics');
  }
}

// 預定義的 Key 模式
export const RedisKeys = {
  // 認證相關
  Auth: {
    userSession: (userId: string) => RedisKeyBuilder.auth().feature('session').id(userId).build(),
    refreshToken: (tokenId: string) =>
      RedisKeyBuilder.auth().feature('refresh').id(tokenId).build(),
    loginAttempts: (ip: string) => RedisKeyBuilder.auth().feature('attempts').id(ip).build(),
  },

  // Web 應用快取
  Web: {
    surveyCache: (surveyId: string) => RedisKeyBuilder.web().feature('survey').id(surveyId).build(),
    userPreferences: (userId: string) => RedisKeyBuilder.web().feature('prefs').id(userId).build(),
    pageCache: (path: string) =>
      RedisKeyBuilder.web().feature('page').id(encodeURIComponent(path)).build(),
  },

  // 後端服務
  Server: {
    taskQueue: (taskType: string) => RedisKeyBuilder.server().feature('queue').id(taskType).build(),
    distributedLock: (resource: string) =>
      RedisKeyBuilder.server().feature('lock').id(resource).build(),
    rateLimitUser: (userId: string) =>
      RedisKeyBuilder.server().feature('rate').id(`user:${userId}`).build(),
    rateLimitIP: (ip: string) => RedisKeyBuilder.server().feature('rate').id(`ip:${ip}`).build(),
  },

  // 問卷功能
  Survey: {
    responseProgress: (surveyId: string, sessionId: string) =>
      RedisKeyBuilder.survey().feature('progress').id(`${surveyId}:${sessionId}`).build(),
    surveyStats: (surveyId: string) =>
      RedisKeyBuilder.survey().feature('stats').id(surveyId).build(),
    realtimeResponses: (surveyId: string) =>
      RedisKeyBuilder.survey().feature('realtime').id(surveyId).build(),
  },

  // 分析統計
  Analytics: {
    dailyStats: (date: string) => RedisKeyBuilder.analytics().feature('daily').id(date).build(),
    userActivity: (userId: string) =>
      RedisKeyBuilder.analytics().feature('activity').id(userId).build(),
    systemMetrics: (metric: string) =>
      RedisKeyBuilder.analytics().feature('metrics').id(metric).build(),
  },
};

// Key 管理工具
export const RedisKeyUtils = {
  // 解析 key 結構
  parse(key: string): { prefix: string; service: string; feature: string; id?: string } | null {
    const parts = key.split(KEY_SEPARATOR);
    if (parts.length < 3 || parts[0] !== KEY_PREFIX) return null;

    const idPart = parts.slice(3).join(KEY_SEPARATOR);
    const result: { prefix: string; service: string; feature: string; id?: string } = {
      prefix: parts[0]!,
      service: parts[1]!,
      feature: parts[2]!,
    };
    if (idPart) result.id = idPart;
    return result;
  },

  // 根據模式搜尋 keys
  pattern(service: string, feature?: string): string {
    let pattern = `${KEY_PREFIX}:${service.toUpperCase()}`;
    if (feature) pattern += `:${feature.toLowerCase()}`;
    return pattern + ':*';
  },

  // 驗證 key 格式
  isValid(key: string): boolean {
    return this.parse(key) !== null;
  },
};
