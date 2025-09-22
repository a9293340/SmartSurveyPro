/**
 * 問卷回應提交 API
 * POST /api/surveys/[id]/responses
 *
 * 處理問卷填寫完成後的提交，包括：
 * - 驗證問卷是否可填寫
 * - 驗證回應資料完整性
 * - 檢查重複提交
 * - 儲存回應到資料庫
 * - 更新問卷統計
 */

import {
  type ResponseDocument,
  type SubmitResponseRequest,
  type SubmitResponseResponse,
  type QuestionAnswerData,
} from '@smartsurvey/shared';
import { dbConnection } from '@smartsurvey/shared/server';
import { ObjectId } from 'mongodb';
import { getClientIP } from '../../../utils/client-ip';
import {
  validateSubmissionRequest,
  validateSurveyAvailable,
  validateSurveyResponse,
  checkDuplicateSubmission,
  generateResponseId,
} from '../../../utils/response-validation';

/**
 * 提交問卷回應
 */
export default defineEventHandler(async (event): Promise<SubmitResponseResponse> => {
  // 只接受 POST 方法
  assertMethod(event, 'POST');

  try {
    // ========================================================================
    // 1. 基本參數驗證
    // ========================================================================

    const surveyId = getRouterParam(event, 'id');
    if (!surveyId) {
      throw createError({
        statusCode: 400,
        statusMessage: '問卷 ID 不能為空',
      });
    }

    // 驗證 surveyId 格式
    if (!ObjectId.isValid(surveyId)) {
      throw createError({
        statusCode: 400,
        statusMessage: '問卷 ID 格式不正確',
      });
    }

    const requestBody = await readBody(event);

    console.warn('[Response API] 📥 收到原始請求資料:', {
      surveyId,
      clientIP: getClientIP(event),
      bodyType: typeof requestBody,
      bodyKeys: requestBody ? Object.keys(requestBody) : 'null',
      requestBody,
    });

    // ========================================================================
    // 2. 驗證請求資料格式
    // ========================================================================

    const validationResult = await validateSubmissionRequest(requestBody);

    if (!validationResult.isValid || !validationResult.data) {
      console.error('[Response API] ❌ 請求資料驗證失敗:', {
        isValid: validationResult.isValid,
        errors: validationResult.errors,
        hasData: !!validationResult.data,
        originalBody: requestBody,
      });

      throw createError({
        statusCode: 400,
        statusMessage: `請求資料格式錯誤: ${validationResult.errors.join(', ')}`,
      });
    }

    const requestData = validationResult.data;

    // 確認請求中的 surveyId 與路徑參數一致
    if (requestData.surveyId !== surveyId) {
      throw createError({
        statusCode: 400,
        statusMessage: '問卷 ID 不一致',
      });
    }

    console.warn('[Response API] 收到回應提交請求:', {
      surveyId,
      answersCount: Object.keys(requestData.answers).length,
      clientIP: getClientIP(event),
    });

    // ========================================================================
    // 3. 驗證問卷是否可填寫
    // ========================================================================

    const surveyValidation = await validateSurveyAvailable(surveyId);

    if (!surveyValidation.isValid || !surveyValidation.survey) {
      throw createError({
        statusCode: 404,
        statusMessage: surveyValidation.error || '問卷不可用',
      });
    }

    const survey = surveyValidation.survey;

    // ========================================================================
    // 4. 驗證回應資料完整性
    // ========================================================================

    const responseValidation = validateSurveyResponse(survey, requestData.answers);

    if (!responseValidation.isValid) {
      const allErrors = [
        ...responseValidation.globalErrors,
        ...Object.values(responseValidation.questionResults)
          .filter(result => !result.isValid)
          .flatMap(result => result.errors),
      ];

      console.error('[Response API] ❌ 回應驗證失敗 (422):', {
        surveyId,
        globalErrors: responseValidation.globalErrors,
        questionResults: responseValidation.questionResults,
        allErrors,
        answersReceived: Object.keys(requestData.answers),
        surveyQuestions: survey.questions?.map(q => ({ id: q.id, required: q.required })),
      });

      throw createError({
        statusCode: 422,
        statusMessage: `回應驗證失敗: ${allErrors.join(', ')}`,
        data: {
          validationDetails: responseValidation,
        },
      });
    }

    // ========================================================================
    // 5. 檢查重複提交
    // ========================================================================

    const duplicateCheck = await checkDuplicateSubmission(event, surveyId, requestData.answers);

    if (duplicateCheck.isDuplicate) {
      console.warn('[Response API] 檢測到重複提交:', {
        surveyId,
        existingResponseId: duplicateCheck.existingResponseId,
        criteria: duplicateCheck.checkCriteria,
      });

      throw createError({
        statusCode: 409,
        statusMessage: '檢測到重複提交，請勿重複送出問卷',
        data: {
          existingResponseId: duplicateCheck.existingResponseId,
        },
      });
    }

    // ========================================================================
    // 6. 準備回應資料
    // ========================================================================

    const responseId = generateResponseId();
    const now = new Date();
    const clientIP = getClientIP(event);
    const userAgent = getHeader(event, 'user-agent') || '';

    // 轉換答案格式
    const answersArray: QuestionAnswerData[] = Object.entries(requestData.answers).map(
      ([questionId, value]) => {
        const question = survey.questions.find((q: any) => q.id === questionId);
        return {
          questionId,
          questionType: question?.type || 'unknown',
          value,
          answeredAt: now,
        };
      }
    );

    // 計算填寫時間
    const duration = Math.max(
      0,
      Math.floor((requestData.endTime.getTime() - requestData.startTime.getTime()) / 1000)
    );

    // 建立回應文檔
    const responseDocument: Omit<ResponseDocument, '_id'> = {
      surveyId: new ObjectId(surveyId),
      responseId,
      status: 'submitted',
      answers: answersArray,
      stats: {
        startTime: requestData.startTime,
        endTime: requestData.endTime,
        duration,
      },
      metadata: {
        ipAddress: clientIP,
        userAgent,
        ...requestData.metadata,
      },
      createdAt: now,
      updatedAt: now,
      submittedAt: now,
    };

    // ========================================================================
    // 7. 儲存到資料庫
    // ========================================================================

    const db = dbConnection.getDatabase();
    const client = dbConnection.getClient();

    // 開始交易
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // 插入回應記錄
        const insertResult = await db
          .collection('responses')
          .insertOne(responseDocument, { session });

        if (!insertResult.insertedId) {
          throw new Error('儲存回應失敗');
        }

        // 更新問卷統計
        await db.collection('surveys').updateOne(
          { _id: new ObjectId(surveyId) },
          {
            $inc: {
              'stats.totalResponses': 1,
              'stats.completedResponses': 1,
            },
            $set: {
              'stats.lastResponseAt': now,
              updatedAt: now,
            },
          },
          { session }
        );

        console.warn('[Response API] 回應儲存成功:', {
          responseId,
          surveyId,
          duration,
          answersCount: answersArray.length,
        });
      });
    } finally {
      await session.endSession();
    }

    // ========================================================================
    // 8. 回傳成功結果
    // ========================================================================

    const response: SubmitResponseResponse = {
      success: true,
      responseId,
      submittedAt: now,
      message: '問卷提交成功',
    };

    // 設定成功狀態碼
    setResponseStatus(event, 201);

    return response;
  } catch (error: any) {
    // ========================================================================
    // 錯誤處理
    // ========================================================================

    console.error('[Response API] 提交回應失敗:', {
      surveyId: getRouterParam(event, 'id'),
      error: error.message,
      stack: error.stack,
    });

    // 如果是已知的 createError，直接拋出
    if (error.statusCode) {
      throw error;
    }

    // 未知錯誤，回傳通用錯誤訊息
    throw createError({
      statusCode: 500,
      statusMessage: '提交回應時發生內部錯誤',
    });
  }
});

// ============================================================================
// 輔助函數
// ============================================================================

/**
 * 取得請求標頭
 */
function getHeader(event: any, name: string): string | undefined {
  return event.node?.req?.headers?.[name] || event.headers?.[name];
}
