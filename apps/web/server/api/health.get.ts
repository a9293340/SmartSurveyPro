/**
 * 健康檢查 API
 * GET /api/health
 */
export default defineEventHandler(async () => {
  // 基本健康狀態
  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    app: {
      name: 'SmartSurvey Pro',
      version: '0.0.1',
      environment: process.env.NODE_ENV || 'development',
    },
    services: {
      api: 'operational',
      // 之後可以加入資料庫檢查
      database: 'not_configured',
      redis: 'not_configured',
    },
  };

  return status;
});
