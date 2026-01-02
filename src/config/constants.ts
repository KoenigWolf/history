/**
 * アプリケーション定数
 * @module config/constants
 */

/** 年の有効範囲 */
export const YEAR_RANGE = {
  MIN: 1800,
  MAX: 2025,
} as const;

/** 月の有効範囲 */
export const MONTH_RANGE = {
  MIN: 1,
  MAX: 12,
} as const;

/** データディレクトリのパス（プロセスルートからの相対パス） */
export const DATA_DIR_PATH = ['src', 'data'] as const;

/** ファイル拡張子 */
export const FILE_EXTENSION = {
  YAML: '.yaml',
} as const;

/** ファイル名パターン */
export const FILE_PATTERNS = {
  /** 年別概要ファイル: {year}.yaml */
  YEAR_SUMMARY: (year: number) => `${year}${FILE_EXTENSION.YAML}`,
  /** 月別ファイル: {year}-{month}.yaml */
  MONTH_DATA: (year: number, month: number) =>
    `${year}-${month.toString().padStart(2, '0')}${FILE_EXTENSION.YAML}`,
  /** 月別ファイル名の正規表現 */
  MONTH_FILE_REGEX: /^\d{4}-(\d{2})\.yaml$/,
} as const;

/** カテゴリの種類 */
export const EVENT_CATEGORIES = [
  '政治・経済',
  '文化',
  '戦争・紛争',
  '災害',
  '科学・技術',
  '社会',
  '外交',
  'その他',
] as const;

/** アプリケーションメタデータ */
export const APP_METADATA = {
  TITLE: '世界史年表',
  TITLE_WITH_RANGE: '世界史年表 | 1800-2025',
  DESCRIPTION: '1800年から2025年までの日本中心の世界史を閲覧できるインタラクティブな年表アプリ',
  LOCALE: 'ja',
} as const;

/** レスポンシブブレークポイント */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/** ページネーション設定 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
