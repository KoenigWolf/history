/**
 * カスタムエラークラス
 * @module domain/errors
 */

/**
 * エラーコード定義
 */
export const ERROR_CODES = {
  // バリデーションエラー
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_YEAR: 'INVALID_YEAR',
  INVALID_MONTH: 'INVALID_MONTH',
  INVALID_DATE: 'INVALID_DATE',

  // データエラー
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  DATA_PARSE_ERROR: 'DATA_PARSE_ERROR',
  DATA_LOAD_ERROR: 'DATA_LOAD_ERROR',

  // システムエラー
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  FILE_READ_ERROR: 'FILE_READ_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * アプリケーション基底エラークラス
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * バリデーションエラー
 */
export class ValidationError extends AppError {
  readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, ERROR_CODES.VALIDATION_ERROR, 400);
    this.field = field;
  }
}

/**
 * データ未発見エラー
 */
export class NotFoundError extends AppError {
  readonly resource: string;
  readonly identifier: string | number;

  constructor(resource: string, identifier: string | number) {
    super(`${resource} not found: ${identifier}`, ERROR_CODES.DATA_NOT_FOUND, 404);
    this.resource = resource;
    this.identifier = identifier;
  }
}

/**
 * データ読み込みエラー
 */
export class DataLoadError extends AppError {
  readonly path: string;
  readonly cause?: Error;

  constructor(message: string, path: string, cause?: Error) {
    super(message, ERROR_CODES.DATA_LOAD_ERROR, 500);
    this.path = path;
    this.cause = cause;
  }
}

/**
 * データパースエラー
 */
export class DataParseError extends AppError {
  readonly path: string;
  readonly cause?: Error;

  constructor(message: string, path: string, cause?: Error) {
    super(message, ERROR_CODES.DATA_PARSE_ERROR, 500);
    this.path = path;
    this.cause = cause;
  }
}

/**
 * エラーがAppErrorインスタンスかチェック
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * 未知のエラーをAppErrorに変換
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }
  if (error instanceof Error) {
    return new AppError(error.message, ERROR_CODES.INTERNAL_ERROR, 500, false);
  }
  return new AppError('An unexpected error occurred', ERROR_CODES.INTERNAL_ERROR, 500, false);
}

/**
 * エラーレスポンスを生成
 */
export function createErrorResponse(error: AppError) {
  return {
    success: false as const,
    error: {
      code: error.code,
      message: error.message,
      ...(error.isOperational ? {} : { internal: true }),
    },
  };
}
