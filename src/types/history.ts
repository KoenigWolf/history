/**
 * 歴史イベントの型定義
 */

/**
 * 個別の歴史イベント
 */
export interface HistoryEvent {
  /** イベントの日付（YYYY-MM-DD形式） */
  date: string;
  /** イベントのタイトル */
  title: string;
  /** カテゴリ（政治・経済、文化、戦争など） */
  category: string;
  /** イベントの詳細説明 */
  description: string;
  /** 関連する国・地域のリスト */
  related_countries: string[];
  /** 参考文献のリスト */
  sources?: string[];
}

/**
 * 月別のデータ構造
 */
export interface MonthData {
  /** 月（1-12） */
  month: number;
  /** 年 */
  year: number;
  /** その月のイベントリスト */
  events: HistoryEvent[];
}

/**
 * 年別のデータ構造（概要用）
 */
export interface YearData {
  /** 年 */
  year: number;
  /** 年の概要説明（オプション） */
  summary?: string;
  /** その年の主要イベント（オプション） */
  majorEvents?: HistoryEvent[];
}

/**
 * 年と月の組み合わせ
 */
export interface YearMonth {
  year: number;
  month: number;
}
