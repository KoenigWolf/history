/**
 * ドメイン型定義
 * @module domain/types
 */

import type { EVENT_CATEGORIES } from '@/config/constants';

// ============================================
// Branded Types（型安全性向上）
// ============================================

/** Year型のブランド */
declare const YearBrand: unique symbol;
/** Month型のブランド */
declare const MonthBrand: unique symbol;
/** DateString型のブランド */
declare const DateStringBrand: unique symbol;

/** 年を表すブランド型（1800-2025の範囲） */
export type Year = number & { readonly [YearBrand]: typeof YearBrand };

/** 月を表すブランド型（1-12の範囲） */
export type Month = number & { readonly [MonthBrand]: typeof MonthBrand };

/** 日付文字列を表すブランド型（YYYY-MM-DD形式） */
export type DateString = string & { readonly [DateStringBrand]: typeof DateStringBrand };

// ============================================
// イベントカテゴリ
// ============================================

/** イベントカテゴリのユニオン型 */
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

// ============================================
// 歴史イベント関連
// ============================================

/**
 * 歴史イベントの基本インターフェース
 */
export interface HistoryEvent {
  /** イベントの日付（YYYY-MM-DD形式） */
  readonly date: DateString;
  /** イベントのタイトル */
  readonly title: string;
  /** カテゴリ */
  readonly category: string;
  /** イベントの詳細説明 */
  readonly description: string;
  /** 関連する国・地域のリスト */
  readonly relatedCountries: readonly string[];
  /** 参考文献のリスト（任意） */
  readonly sources?: readonly string[];
}

/**
 * 月別データ構造
 */
export interface MonthData {
  /** 月（1-12） */
  readonly month: Month;
  /** 年 */
  readonly year: Year;
  /** その月のイベントリスト */
  readonly events: readonly HistoryEvent[];
}

/**
 * 年別データ構造（概要用）
 */
export interface YearData {
  /** 年 */
  readonly year: Year;
  /** 年の概要説明（任意） */
  readonly summary?: string;
  /** その年の主要イベント（任意） */
  readonly majorEvents?: readonly HistoryEvent[];
}

/**
 * 年と月の組み合わせ
 */
export interface YearMonth {
  readonly year: Year;
  readonly month: Month;
}

// ============================================
// APIレスポンス型
// ============================================

/**
 * 成功レスポンス
 */
export interface SuccessResult<T> {
  readonly success: true;
  readonly data: T;
}

/**
 * 失敗レスポンス
 */
export interface ErrorResult {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}

/**
 * 結果型（成功または失敗）
 */
export type Result<T> = SuccessResult<T> | ErrorResult;

// ============================================
// ページパラメータ型
// ============================================

/**
 * 年別ページのパラメータ
 */
export interface YearPageParams {
  readonly year: string;
}

/**
 * 月別ページのパラメータ
 */
export interface MonthPageParams {
  readonly year: string;
  readonly month: string;
}

// ============================================
// 統計型
// ============================================

/**
 * 年別統計
 */
export interface YearStatistics {
  readonly year: Year;
  readonly totalEvents: number;
  readonly monthsWithData: number;
}

/**
 * 月別統計
 */
export interface MonthStatistics {
  readonly year: Year;
  readonly month: Month;
  readonly eventCount: number;
}
