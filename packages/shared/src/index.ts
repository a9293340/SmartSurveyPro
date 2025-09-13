// SmartSurvey Pro - 共享套件入口點

// 基礎版本資訊
export const VERSION = '0.0.1'

// 資料庫連接
export { connectToDatabase, getDatabase, dbConnection } from './db/connection'

// 暫時的基礎匯出，後續任務會擴展
export const SHARED_READY = true