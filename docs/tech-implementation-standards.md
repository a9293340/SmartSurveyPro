# SmartSurvey Pro - 技術實作規範

> 📅 文件版本：v1.0  
> 📝 最後更新：2025-09-11  
> 👤 適用範圍：一人開發團隊  
> 🎯 目標：確保程式碼品質與長期可維護性

---

## 📋 目錄

1. [專案結構規範](#專案結構規範)
2. [前端程式碼規範 (Vue3/Nuxt3)](#前端程式碼規範)
3. [後端程式碼規範 (Nitro/Node.js)](#後端程式碼規範)
4. [Go 程式碼規範](#go-程式碼規範)
5. [Git 工作流程](#git-工作流程)
6. [品質把控機制](#品質把控機制)
7. [自動化檢查配置](#自動化檢查配置)

---

## 🏗️ 專案結構規範

### Monorepo 整體結構

```
smartsurvey-pro/
├── apps/
│   ├── web/                    # Nuxt3 主應用
│   ├── admin/                  # 管理後台 (Phase 3+)
│   └── mobile/                 # 移動端 (Phase 6+)
├── services/
│   ├── api/                    # Go API 服務 (Phase 5+)
│   └── analytics/              # 分析服務 (Phase 7+)
├── packages/
│   ├── shared/                 # 共享類型定義
│   ├── ui/                     # UI 組件庫 (Phase 3+)
│   ├── core/                   # 核心業務邏輯 (Phase 4+)
│   └── utils/                  # 工具函數
├── config/                     # 配置檔案
├── docs/                       # 文檔
├── scripts/                    # 腳本工具
└── tools/                      # 開發工具
```

### Apps/Web (Nuxt3) 結構

```
apps/web/
├── components/                 # Vue 組件
│   ├── ui/                    # 基礎 UI 組件
│   ├── survey/                # 問卷相關組件
│   ├── editor/                # 編輯器組件
│   └── layout/                # 布局組件
├── composables/               # Vue 組合式函數
├── layouts/                   # Nuxt 布局
├── middleware/               # 路由中介軟體
├── pages/                    # 頁面路由
├── plugins/                  # Nuxt 插件
├── server/                   # Nitro 後端
│   ├── api/                  # API 路由
│   ├── middleware/           # 伺服器中介軟體
│   └── utils/                # 伺服器工具
├── stores/                   # Pinia 狀態管理
├── types/                    # TypeScript 類型
└── utils/                    # 工具函數
```

---

## 🎨 前端程式碼規範 (Vue3/Nuxt3)

### 檔案命名規範

```typescript
// ✅ 正確命名
components/
├── ui/
│   ├── UiButton.vue          # UI 組件用 Ui 前綴
│   ├── UiInput.vue
│   └── UiModal.vue
├── survey/
│   ├── SurveyEditor.vue      # 功能組件用功能前綴
│   ├── SurveyPreview.vue
│   └── SurveyStats.vue
└── layout/
    ├── TheHeader.vue         # 唯一組件用 The 前綴
    ├── TheSidebar.vue
    └── TheFooter.vue

composables/
├── useAuth.ts                # use 前綴
├── useSurvey.ts
└── useAPI.ts

stores/
├── auth.ts                   # 小寫，無前綴
├── survey.ts
└── settings.ts

// ❌ 錯誤命名
├── button.vue               # 應該是 UiButton.vue
├── surveyEditor.vue         # 應該是 SurveyEditor.vue
├── UseAuth.ts               # 應該是 useAuth.ts
```

### Vue 組件規範

#### 1. 組件結構順序

```vue
<template>
  <!-- HTML 模板 -->
</template>

<script setup lang="ts">
// 1. 引入 (imports)
import { ref, computed, onMounted } from 'vue';
import type { PropType } from 'vue';

// 2. 類型定義
interface User {
  id: string;
  name: string;
}

// 3. Props 定義
interface Props {
  title: string;
  users?: User[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  users: () => [],
  isLoading: false,
});

// 4. Emits 定義
interface Emits {
  submit: [data: User];
  cancel: [];
}

const emit = defineEmits<Emits>();

// 5. 響應式數據
const isVisible = ref(false);
const selectedUser = ref<User | null>(null);

// 6. 計算屬性
const displayUsers = computed(() => {
  return props.users.filter(user => user.name.length > 0);
});

// 7. 方法
const handleSubmit = () => {
  if (selectedUser.value) {
    emit('submit', selectedUser.value);
  }
};

// 8. 生命週期
onMounted(() => {
  // 初始化邏輯
});
</script>

<style scoped>
/* CSS 樣式 */
</style>
```

#### 2. Props 定義規範

```typescript
// ✅ 推薦：使用 TypeScript interface
interface Props {
  // 必須屬性
  title: string;
  userId: string;

  // 可選屬性，提供預設值
  isActive?: boolean;
  items?: string[];

  // 複雜類型
  user?: User;
  config?: SurveyConfig;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  items: () => [],
  config: () => ({
    theme: 'default',
    allowEdit: true,
  }),
});

// ❌ 避免：運行時驗證 (一人團隊不需要過度複雜)
const props = defineProps({
  title: {
    type: String,
    required: true,
    validator: (value: string) => value.length > 0,
  },
});
```

#### 3. 事件處理規範

```typescript
// ✅ 推薦：使用 TypeScript 類型定義 emits
interface Emits {
  // 事件名稱：[參數類型]
  'update:modelValue': [value: string];
  'survey:save': [survey: Survey];
  'user:delete': [userId: string];
  'validation:error': [errors: ValidationError[]];
}

const emit = defineEmits<Emits>();

// 使用時保持命名一致性
const handleSave = (survey: Survey) => {
  emit('survey:save', survey);
};

// ❌ 避免：不明確的事件名稱
emit('update', data); // 太籠統
emit('click', event); // 沒有業務意義
```

### Composables 規範

```typescript
// composables/useSurvey.ts
import { ref, computed } from 'vue';
import type { Survey, CreateSurveyRequest } from '~/types/survey';

export const useSurvey = () => {
  // 狀態
  const surveys = ref<Survey[]>([]);
  const currentSurvey = ref<Survey | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // 計算屬性
  const activeSurveys = computed(() => {
    return surveys.value.filter(survey => survey.status === 'active');
  });

  // 方法
  const fetchSurveys = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data } = await $fetch<{ surveys: Survey[] }>('/api/surveys');
      surveys.value = data.surveys;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  };

  const createSurvey = async (
    request: CreateSurveyRequest
  ): Promise<Survey | null> => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data } = await $fetch<{ survey: Survey }>('/api/surveys', {
        method: 'POST',
        body: request,
      });

      surveys.value.push(data.survey);
      return data.survey;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to create survey';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // 返回所有公開的狀態和方法
  return {
    // 狀態
    surveys: readonly(surveys),
    currentSurvey: readonly(currentSurvey),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // 計算屬性
    activeSurveys,

    // 方法
    fetchSurveys,
    createSurvey,
  };
};
```

### Pinia Store 規範

```typescript
// stores/auth.ts
import { defineStore } from 'pinia';
import type { User, LoginRequest, RegisterRequest } from '~/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    userName: (state): string => {
      return state.user ? `${state.user.firstName} ${state.user.lastName}` : '';
    },

    hasPermission: state => {
      return (permission: string): boolean => {
        return state.user?.permissions?.includes(permission) ?? false;
      };
    },
  },

  actions: {
    async login(credentials: LoginRequest): Promise<boolean> {
      try {
        this.isLoading = true;

        const { data } = await $fetch<{
          user: User;
          token: string;
        }>('/api/auth/login', {
          method: 'POST',
          body: credentials,
        });

        this.user = data.user;
        this.token = data.token;
        this.isAuthenticated = true;

        // 儲存到 localStorage
        const tokenCookie = useCookie('auth-token', {
          default: () => null,
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        tokenCookie.value = data.token;

        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async logout(): Promise<void> {
      // 清理本地狀態
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      // 清理 cookie
      const tokenCookie = useCookie('auth-token');
      tokenCookie.value = null;

      // 重定向到登入頁
      await navigateTo('/login');
    },

    async validateToken(): Promise<boolean> {
      const tokenCookie = useCookie('auth-token');
      if (!tokenCookie.value) {
        return false;
      }

      try {
        const { data } = await $fetch<{ user: User }>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${tokenCookie.value}`,
          },
        });

        this.user = data.user;
        this.token = tokenCookie.value;
        this.isAuthenticated = true;
        return true;
      } catch {
        await this.logout();
        return false;
      }
    },
  },
});
```

---

## ⚙️ 後端程式碼規範 (Nitro/Node.js)

### API 路由結構

```typescript
// server/api/surveys/index.get.ts
export default defineEventHandler(async event => {
  try {
    // 1. 驗證權限
    const user = await validateAuthToken(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    // 2. 解析查詢參數
    const query = getQuery(event);
    const { page = 1, limit = 10, status } = query;

    // 3. 驗證參數
    const validation = await validateQuery({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
    });

    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid query parameters',
        data: validation.errors,
      });
    }

    // 4. 業務邏輯
    const surveys = await getSurveysByUser(user.id, {
      page: validation.data.page,
      limit: validation.data.limit,
      status: validation.data.status,
    });

    // 5. 回傳結果
    return {
      success: true,
      data: {
        surveys: surveys.items,
        pagination: surveys.pagination,
      },
    };
  } catch (error) {
    // 統一錯誤處理
    return handleAPIError(error);
  }
});
```

### 中介軟體規範

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async event => {
  // 只處理 API 路由
  if (!event.node.req.url?.startsWith('/api/')) {
    return;
  }

  // 跳過不需要認證的路由
  const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/health'];
  if (publicRoutes.includes(event.node.req.url)) {
    return;
  }

  try {
    const token =
      getCookie(event, 'auth-token') ||
      getHeader(event, 'authorization')?.replace('Bearer ', '');

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication token required',
      });
    }

    const user = await validateJWTToken(token);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token',
      });
    }

    // 將用戶資訊附加到 context
    event.context.user = user;
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication failed',
    });
  }
});
```

### 錯誤處理規範

```typescript
// server/utils/error-handler.ts
interface APIError {
  statusCode: number;
  statusMessage: string;
  data?: any;
}

export const handleAPIError = (error: unknown): APIError => {
  // H3 錯誤 (createError)
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return error as APIError;
  }

  // MongoDB 錯誤
  if (error instanceof Error) {
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: parseValidationError(error),
      };
    }

    if (error.name === 'CastError') {
      return {
        statusCode: 400,
        statusMessage: 'Invalid ID format',
      };
    }

    if (error.message.includes('duplicate key')) {
      return {
        statusCode: 409,
        statusMessage: 'Resource already exists',
      };
    }
  }

  // 預設錯誤
  console.error('Unhandled API error:', error);
  return {
    statusCode: 500,
    statusMessage: 'Internal server error',
  };
};

// 統一回應格式
export const createAPIResponse = <T>(data: T, message?: string) => {
  return {
    success: true,
    message: message || 'Success',
    data,
    timestamp: new Date().toISOString(),
  };
};

export const createAPIErrorResponse = (error: APIError) => {
  return {
    success: false,
    message: error.statusMessage,
    data: error.data || null,
    timestamp: new Date().toISOString(),
  };
};
```

---

## 🔧 Go 程式碼規範

### 專案結構 (Phase 5+)

```
services/api/
├── cmd/
│   └── server/
│       └── main.go            # 程式入口
├── internal/                  # 私有程式碼
│   ├── config/               # 配置
│   ├── handlers/             # HTTP 處理器
│   ├── middleware/           # 中介軟體
│   ├── models/               # 資料模型
│   ├── repositories/         # 資料存取層
│   ├── services/             # 業務邏輯層
│   └── utils/                # 工具函數
├── pkg/                      # 公開程式碼
│   ├── auth/                 # 認證套件
│   ├── database/             # 資料庫套件
│   └── logger/               # 日誌套件
├── api/                      # API 定義
│   └── v1/                   # API v1 版本
├── migrations/               # 資料庫遷移
├── scripts/                  # 腳本
├── go.mod
└── go.sum
```

### 程式碼風格

```go
// internal/handlers/survey.go
package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "your-domain/smartsurvey/internal/models"
    "your-domain/smartsurvey/internal/services"
)

// SurveyHandler 處理問卷相關的 HTTP 請求
type SurveyHandler struct {
    surveyService services.SurveyService
    logger        logger.Logger
}

// NewSurveyHandler 建立新的問卷處理器
func NewSurveyHandler(surveyService services.SurveyService, logger logger.Logger) *SurveyHandler {
    return &SurveyHandler{
        surveyService: surveyService,
        logger:        logger,
    }
}

// GetSurveys 取得問卷列表
func (h *SurveyHandler) GetSurveys(c *gin.Context) {
    // 1. 驗證用戶權限
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{
            "success": false,
            "message": "Unauthorized",
        })
        return
    }

    // 2. 解析查詢參數
    pageStr := c.DefaultQuery("page", "1")
    limitStr := c.DefaultQuery("limit", "10")
    status := c.Query("status")

    page, err := strconv.Atoi(pageStr)
    if err != nil || page < 1 {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "message": "Invalid page parameter",
        })
        return
    }

    limit, err := strconv.Atoi(limitStr)
    if err != nil || limit < 1 || limit > 100 {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "message": "Invalid limit parameter",
        })
        return
    }

    // 3. 建立查詢參數
    params := models.SurveyQueryParams{
        UserID: userID.(string),
        Page:   page,
        Limit:  limit,
        Status: status,
    }

    // 4. 調用服務層
    surveys, err := h.surveyService.GetSurveysByUser(c.Request.Context(), params)
    if err != nil {
        h.logger.Error("Failed to get surveys", "error", err, "user_id", userID)
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "message": "Failed to retrieve surveys",
        })
        return
    }

    // 5. 回傳結果
    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "data": gin.H{
            "surveys":    surveys.Items,
            "pagination": surveys.Pagination,
        },
    })
}

// CreateSurvey 建立新問卷
func (h *SurveyHandler) CreateSurvey(c *gin.Context) {
    userID, _ := c.Get("user_id")

    var req models.CreateSurveyRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "message": "Invalid request body",
            "errors":  err.Error(),
        })
        return
    }

    // 驗證請求資料
    if err := req.Validate(); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "message": "Validation failed",
            "errors":  err,
        })
        return
    }

    survey, err := h.surveyService.CreateSurvey(c.Request.Context(), userID.(string), req)
    if err != nil {
        h.logger.Error("Failed to create survey", "error", err, "user_id", userID)
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "message": "Failed to create survey",
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "success": true,
        "data": gin.H{
            "survey": survey,
        },
    })
}
```

### 服務層規範

```go
// internal/services/survey.go
package services

import (
    "context"
    "fmt"

    "your-domain/smartsurvey/internal/models"
    "your-domain/smartsurvey/internal/repositories"
)

// SurveyService 定義問卷服務介面
type SurveyService interface {
    GetSurveysByUser(ctx context.Context, params models.SurveyQueryParams) (*models.SurveyListResponse, error)
    CreateSurvey(ctx context.Context, userID string, req models.CreateSurveyRequest) (*models.Survey, error)
    GetSurveyByID(ctx context.Context, id, userID string) (*models.Survey, error)
    UpdateSurvey(ctx context.Context, id, userID string, req models.UpdateSurveyRequest) (*models.Survey, error)
    DeleteSurvey(ctx context.Context, id, userID string) error
}

// surveyService 實作 SurveyService 介面
type surveyService struct {
    surveyRepo repositories.SurveyRepository
    userRepo   repositories.UserRepository
    logger     logger.Logger
}

// NewSurveyService 建立新的問卷服務
func NewSurveyService(
    surveyRepo repositories.SurveyRepository,
    userRepo repositories.UserRepository,
    logger logger.Logger,
) SurveyService {
    return &surveyService{
        surveyRepo: surveyRepo,
        userRepo:   userRepo,
        logger:     logger,
    }
}

// GetSurveysByUser 取得用戶的問卷列表
func (s *surveyService) GetSurveysByUser(ctx context.Context, params models.SurveyQueryParams) (*models.SurveyListResponse, error) {
    // 1. 驗證用戶存在
    _, err := s.userRepo.GetByID(ctx, params.UserID)
    if err != nil {
        return nil, fmt.Errorf("user not found: %w", err)
    }

    // 2. 取得問卷列表
    surveys, total, err := s.surveyRepo.GetByUserID(ctx, params)
    if err != nil {
        s.logger.Error("Failed to get surveys from repository", "error", err, "params", params)
        return nil, fmt.Errorf("failed to get surveys: %w", err)
    }

    // 3. 計算分頁資訊
    totalPages := (total + params.Limit - 1) / params.Limit
    pagination := models.Pagination{
        Page:       params.Page,
        Limit:      params.Limit,
        Total:      total,
        TotalPages: totalPages,
        HasNext:    params.Page < totalPages,
        HasPrev:    params.Page > 1,
    }

    return &models.SurveyListResponse{
        Items:      surveys,
        Pagination: pagination,
    }, nil
}

// CreateSurvey 建立新問卷
func (s *surveyService) CreateSurvey(ctx context.Context, userID string, req models.CreateSurveyRequest) (*models.Survey, error) {
    // 1. 驗證用戶權限（例如：訂閱方案限制）
    user, err := s.userRepo.GetByID(ctx, userID)
    if err != nil {
        return nil, fmt.Errorf("user not found: %w", err)
    }

    // 檢查用戶是否還能建立問卷
    canCreate, err := s.checkSurveyCreationLimit(ctx, user)
    if err != nil {
        return nil, fmt.Errorf("failed to check creation limit: %w", err)
    }
    if !canCreate {
        return nil, fmt.Errorf("survey creation limit reached")
    }

    // 2. 建立問卷物件
    survey := &models.Survey{
        Title:       req.Title,
        Description: req.Description,
        UserID:      userID,
        Status:      models.SurveyStatusDraft,
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    }

    // 3. 儲存到資料庫
    err = s.surveyRepo.Create(ctx, survey)
    if err != nil {
        s.logger.Error("Failed to create survey", "error", err, "survey", survey)
        return nil, fmt.Errorf("failed to create survey: %w", err)
    }

    return survey, nil
}

// checkSurveyCreationLimit 檢查問卷建立限制
func (s *surveyService) checkSurveyCreationLimit(ctx context.Context, user *models.User) (bool, error) {
    // 根據用戶訂閱方案檢查限制
    switch user.SubscriptionPlan {
    case models.PlanFree:
        count, err := s.surveyRepo.CountByUserID(ctx, user.ID)
        if err != nil {
            return false, err
        }
        return count < 3, nil // 免費版限制 3 個問卷
    case models.PlanPro, models.PlanTeam, models.PlanEnterprise:
        return true, nil // 付費版無限制
    default:
        return false, nil
    }
}
```

---

## 🌿 Git 工作流程

### 分支策略（一人團隊優化）

```bash
# 簡化的 Git Flow，減少複雜度
main                    # 生產環境，穩定版本
├── develop            # 開發主線，整合分支
├── feature/xxx        # 功能分支
└── hotfix/xxx         # 緊急修復分支

# 分支命名規範
feature/survey-editor           # 新功能
feature/ai-integration          # AI 整合
hotfix/auth-token-bug          # 緊急修復
refactor/database-optimization  # 重構
```

### Commit 訊息規範

```bash
# 格式：<type>(<scope>): <subject>

# Type 類型
feat:     新功能
fix:      修復 bug
docs:     文檔更新
style:    程式碼格式調整（不影響功能）
refactor: 重構程式碼
test:     測試相關
chore:    建置工具、輔助工具變動

# 範例
feat(survey): add drag and drop functionality
fix(auth): resolve token expiration issue
docs(api): update authentication documentation
refactor(database): optimize query performance
chore(deps): upgrade nuxt to v3.8.0

# 多行訊息格式
feat(editor): implement real-time collaboration

- Add WebSocket connection for real-time updates
- Implement conflict resolution algorithm
- Add user cursor display
- Update UI for collaboration indicators

Closes #123
```

### Pull Request 規範（自我 Review）

```markdown
## PR Template

### 📝 變更摘要

簡述這次變更的內容和目的

### 🔄 變更類型

- [ ] 新功能 (feature)
- [ ] 修復 (fix)
- [ ] 重構 (refactor)
- [ ] 文檔 (docs)
- [ ] 測試 (test)

### 🧪 測試項目

- [ ] 單元測試通過
- [ ] 整合測試通過
- [ ] 手動測試完成
- [ ] 無回歸問題

### 📋 檢查清單

- [ ] 程式碼符合規範
- [ ] 沒有 console.log 或除錯程式碼
- [ ] TypeScript 類型檢查通過
- [ ] ESLint 檢查通過
- [ ] 效能影響評估
- [ ] 安全性檢查

### 📸 截圖/錄影

（如有 UI 變更，請提供截圖或錄影）

### 🔗 相關 Issue

Closes #123 Related to #456
```

---

## 🔍 品質把控機制

### 1. 必要驗證規範 ⚠️

**📋 提交代碼前必須通過以下檢查：**

1. **ESLint 檢查** - 確保代碼符合品質標準

   ```bash
   pnpm lint:check  # 檢查所有問題
   pnpm lint        # 自動修復可修復的問題
   ```

2. **TypeScript 類型檢查** - 確保類型安全

   ```bash
   pnpm type-check  # 檢查類型錯誤
   ```

3. **Prettier 格式化** - 確保代碼格式統一
   ```bash
   pnpm format:check  # 檢查格式問題
   pnpm format        # 自動格式化所有文件
   ```

**🔴 重要提醒：**

- 所有三項檢查都必須通過，才能提交代碼
- 使用 `pnpm quality` 一次性運行所有檢查
- 建議設置 IDE 自動格式化，提升開發效率

### 2. 自動化檢查清單

```json
// package.json - scripts 設定
{
  "scripts": {
    "lint": "eslint . --ext .vue,.js,.ts",
    "lint:fix": "eslint . --ext .vue,.js,.ts --fix",
    "type-check": "vue-tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest --coverage",
    "quality": "npm run lint && npm run type-check && npm run format:check && npm run test",
    "commit": "npm run quality && git add . && git commit"
  }
}
```

### 2. Pre-commit Hook

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# 1. Lint staged files
npx lint-staged

# 2. Type check
echo "📝 Type checking..."
npm run type-check

# 3. Run tests related to staged files
echo "🧪 Running tests..."
npm run test -- --run --reporter=verbose

echo "✅ Pre-commit checks passed!"
```

```json
// .lintstagedrc.json
{
  "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
  "*.{css,scss,html,md,json}": ["prettier --write"]
}
```

### 3. 程式碼品質指標

```typescript
// 程式碼複雜度檢查配置
// .eslintrc.js
module.exports = {
  rules: {
    // 認知複雜度 (一人團隊建議放寬到 15)
    complexity: ['warn', 15],

    // 函數長度限制
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true }],

    // 檔案長度限制
    'max-lines': ['warn', { max: 300, skipBlankLines: true }],

    // 參數數量限制
    'max-params': ['warn', 5],

    // 巢狀深度限制
    'max-depth': ['warn', 4],

    // 變數命名規範
    camelcase: ['error', { properties: 'never' }],

    // 禁止未使用的變數
    'no-unused-vars': 'error',

    // 禁止 console.log（警告，而非錯誤）
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
```

### 4. 效能監控

```typescript
// utils/performance.ts
export const performanceMonitor = {
  // 測量函數執行時間
  measureTime: <T>(fn: () => T, label: string): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    if (end - start > 100) {
      // 超過 100ms 就警告
      console.warn(
        `🐌 Slow operation: ${label} took ${(end - start).toFixed(2)}ms`
      );
    }

    return result;
  },

  // 測量非同步函數執行時間
  measureAsyncTime: async <T>(
    fn: () => Promise<T>,
    label: string
  ): Promise<T> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();

    if (end - start > 500) {
      // 非同步操作超過 500ms 就警告
      console.warn(
        `🐌 Slow async operation: ${label} took ${(end - start).toFixed(2)}ms`
      );
    }

    return result;
  },
};

// 使用範例
const surveys = await performanceMonitor.measureAsyncTime(
  () => fetchSurveys(),
  'fetchSurveys'
);
```

### 5. 記憶體洩漏檢查

```typescript
// utils/memory-monitor.ts
export const memoryMonitor = {
  // 檢查大型物件
  checkObjectSize: (obj: any, name: string) => {
    const size = JSON.stringify(obj).length;
    if (size > 1024 * 1024) {
      // 超過 1MB
      console.warn(
        `💾 Large object detected: ${name} is ${(size / 1024 / 1024).toFixed(2)}MB`
      );
    }
  },

  // Vue 組件記憶體洩漏檢查
  trackComponentMemory: (componentName: string) => {
    if (process.client) {
      console.log(`📊 Memory usage after ${componentName}:`, {
        used: Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024) || 0,
        total:
          Math.round(performance.memory?.totalJSHeapSize / 1024 / 1024) || 0,
      });
    }
  },
};
```

---

## ⚙️ 自動化檢查配置

### ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Vue 規則
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/component-tags-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],

    // TypeScript 規則
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // 通用規則
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',

    // 程式碼品質
    complexity: ['warn', 15],
    'max-lines-per-function': ['warn', { max: 50 }],
    'max-depth': ['warn', 4],
    'max-params': ['warn', 5],
  },
};
```

### Prettier 配置

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "none",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": false
}
```

### TypeScript 配置

```json
// tsconfig.json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["**/*.ts", "**/*.vue"],
  "exclude": ["node_modules", "dist", ".nuxt"]
}
```

### Vitest 測試配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    setupFiles: ['./test/setup.ts'],
  },
});
```

---

## 📋 日常開發檢查清單

### 🌅 每日開始前

- [ ] `git pull origin develop` 同步最新代碼
- [ ] `npm install` 更新依賴（如有需要）
- [ ] `npm run quality` 檢查程式碼品質
- [ ] 檢視 GitHub Issues 和 Project Board

### ⚡ 開發過程中

- [ ] 每個功能都有對應的測試
- [ ] 複雜邏輯有註解說明
- [ ] 新增的 API 都有類型定義
- [ ] 沒有 hardcode 的常數值
- [ ] 錯誤處理完整

### 🌙 提交前檢查

- [ ] `npm run quality` 通過
- [ ] 手動測試功能正常
- [ ] 檢查 Network 面板無異常請求
- [ ] 檢查 Console 無錯誤訊息
- [ ] 效能影響評估
- [ ] Git commit 訊息符合規範

### 📅 每週檢查

- [ ] 依賴套件安全性檢查 `npm audit`
- [ ] 效能分析報告
- [ ] 程式碼覆蓋率報告
- [ ] 技術債務評估
- [ ] 備份重要檔案

---

## 🎯 小結

這份技術實作規範旨在：

1. **提高程式碼品質**：通過 linting、格式化、測試等自動化工具
2. **增強可維護性**：清晰的結構、命名規範、註解
3. **減少 Bug**：完整的類型檢查、錯誤處理、測試覆蓋
4. **提升開發效率**：自動化檢查、清晰的工作流程
5. **便於未來擴展**：模組化設計、清晰的架構分層

記住：**品質是習慣，不是行為**。堅持執行這些規範，會讓您的專案更加穩健和可維護！

---

_本文檔會隨著專案發展持續更新和優化。_
