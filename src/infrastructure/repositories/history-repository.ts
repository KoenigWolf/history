/**
 * 歴史データリポジトリ
 * ファイルシステムからのデータ読み込みを抽象化
 * @module infrastructure/repositories/history-repository
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';

import { DATA_DIR_PATH, FILE_PATTERNS } from '@/config/constants';
import type { Year, Month, HistoryEvent, MonthData, YearData } from '@/domain/types';
import { monthDataSchema, yearDataSchema } from '@/domain/validation/schemas';
import { isValidYear, isValidMonth, createDateString } from '@/domain/validation/validators';
import { withCache, cacheKeys } from '@/infrastructure/cache';
import { logger } from '@/infrastructure/logger';
import {
  isSafeString,
  sanitizeString,
  isSafeStringArray,
  sanitizeStringArray,
  isRecord,
  isRecordArray,
} from '@/infrastructure/security';

/** データディレクトリの絶対パス */
const DATA_DIR = join(process.cwd(), ...DATA_DIR_PATH);

/**
 * 型安全なプロパティ取得
 */
function getStringProp(obj: Record<string, unknown>, key: string): string {
  const value = obj[key];
  if (!isSafeString(value)) return '';
  return sanitizeString(value);
}

/**
 * 型安全な文字列配列プロパティ取得
 */
function getStringArrayProp(obj: Record<string, unknown>, key: string): string[] {
  const value = obj[key];
  if (isSafeStringArray(value)) return value;
  return sanitizeStringArray(value);
}

/**
 * 型安全なオプショナル文字列プロパティ取得
 */
function getOptionalStringProp(obj: Record<string, unknown>, key: string): string | undefined {
  const value = obj[key];
  if (value === undefined || value === null) return undefined;
  if (!isSafeString(value)) return undefined;
  return sanitizeString(value);
}

/**
 * YAMLデータを正規化してドメイン型に変換
 * 型安全性を強化
 */
function normalizeHistoryEvent(raw: unknown): HistoryEvent | null {
  if (!isRecord(raw)) {
    logger.warn('Invalid event data: not an object');
    return null;
  }

  const date = getStringProp(raw, 'date');
  const title = getStringProp(raw, 'title');
  const category = getStringProp(raw, 'category');
  const description = getStringProp(raw, 'description');

  // 必須フィールドの検証
  if (!date || !title || !category || !description) {
    logger.warn('Invalid event data: missing required fields', {
      hasDate: !!date,
      hasTitle: !!title,
      hasCategory: !!category,
      hasDescription: !!description,
    });
    return null;
  }

  return {
    date: createDateString(date),
    title,
    category,
    description,
    relatedCountries: getStringArrayProp(raw, 'related_countries'),
    sources: getOptionalStringProp(raw, 'sources')
      ? getStringArrayProp(raw, 'sources')
      : undefined,
  };
}

/**
 * 月別データを正規化
 */
function normalizeMonthData(raw: unknown, year: Year, month: Month): MonthData | null {
  if (!isRecord(raw)) {
    logger.warn('Invalid month data: not an object');
    return null;
  }

  const eventsRaw = raw.events;
  const events: HistoryEvent[] = [];

  if (isRecordArray(eventsRaw)) {
    for (const eventRaw of eventsRaw) {
      const event = normalizeHistoryEvent(eventRaw);
      if (event) events.push(event);
    }
  }

  return {
    year,
    month,
    events,
  };
}

/**
 * 年別データを正規化
 */
function normalizeYearData(raw: unknown, year: Year): YearData | null {
  if (!isRecord(raw)) {
    logger.warn('Invalid year data: not an object');
    return null;
  }

  const majorEventsRaw = raw.majorEvents;
  let majorEvents: HistoryEvent[] | undefined;

  if (isRecordArray(majorEventsRaw)) {
    majorEvents = [];
    for (const eventRaw of majorEventsRaw) {
      const event = normalizeHistoryEvent(eventRaw);
      if (event) majorEvents.push(event);
    }
  }

  return {
    year,
    summary: getOptionalStringProp(raw, 'summary'),
    majorEvents: majorEvents?.length ? majorEvents : undefined,
  };
}

/**
 * 歴史データリポジトリインターフェース
 */
export interface IHistoryRepository {
  getAvailableYears(): Promise<Year[]>;
  getAvailableMonths(year: Year): Promise<Month[]>;
  getYearData(year: Year): Promise<YearData | null>;
  getMonthData(year: Year, month: Month): Promise<MonthData | null>;
  getAllMonthsForYear(year: Year): Promise<MonthData[]>;
  getAllEventsForYear(year: Year): Promise<HistoryEvent[]>;
}

/**
 * ファイルシステムベースの歴史データリポジトリ実装
 */
export class FileSystemHistoryRepository implements IHistoryRepository {
  private readonly dataDir: string;

  constructor(dataDir: string = DATA_DIR) {
    this.dataDir = dataDir;
  }

  /**
   * 利用可能な年のリストを取得
   */
  async getAvailableYears(): Promise<Year[]> {
    return withCache(cacheKeys.years(), async () => {
      try {
        const entries = await readdir(this.dataDir, { withFileTypes: true });
        const years = entries
          .filter((entry) => entry.isDirectory())
          .map((entry) => parseInt(entry.name, 10))
          .filter(isValidYear)
          .sort((a, b) => a - b);

        logger.debug('Loaded available years', { count: years.length });
        return years;
      } catch (error) {
        logger.error('Failed to read years directory', error);
        return [];
      }
    });
  }

  /**
   * 指定した年の利用可能な月のリストを取得
   */
  async getAvailableMonths(year: Year): Promise<Month[]> {
    return withCache(cacheKeys.availableMonths(year), async () => {
      try {
        const yearDir = join(this.dataDir, year.toString());
        const entries = await readdir(yearDir, { withFileTypes: true });

        const months = entries
          .filter((entry) => {
            if (!entry.isFile()) return false;
            return FILE_PATTERNS.MONTH_FILE_REGEX.test(entry.name);
          })
          .map((entry) => {
            const match = entry.name.match(FILE_PATTERNS.MONTH_FILE_REGEX);
            return match ? parseInt(match[1], 10) : null;
          })
          .filter((month): month is Month => month !== null && isValidMonth(month))
          .sort((a, b) => a - b);

        logger.debug('Loaded available months', { year, count: months.length });
        return months;
      } catch (error) {
        logger.error('Failed to read months directory', error, { year });
        return [];
      }
    });
  }

  /**
   * 年別の概要データを取得
   */
  async getYearData(year: Year): Promise<YearData | null> {
    return withCache(cacheKeys.yearData(year), async () => {
      try {
        const filePath = join(this.dataDir, year.toString(), FILE_PATTERNS.YEAR_SUMMARY(year));
        const fileContent = await readFile(filePath, 'utf-8');
        const rawData = parse(fileContent);

        // スキーマバリデーション
        const validation = yearDataSchema.safeParse(rawData);
        if (!validation.success) {
          logger.warn('Year data validation failed', {
            year,
            issues: validation.error.issues.length,
          });
        }

        const normalized = normalizeYearData(rawData, year);
        if (normalized) {
          logger.debug('Loaded year data', { year });
        }
        return normalized;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return null;
        }
        logger.error('Failed to load year data', error, { year });
        return null;
      }
    });
  }

  /**
   * 月別の詳細データを取得
   */
  async getMonthData(year: Year, month: Month): Promise<MonthData | null> {
    return withCache(cacheKeys.monthData(year, month), async () => {
      try {
        const filePath = join(
          this.dataDir,
          year.toString(),
          FILE_PATTERNS.MONTH_DATA(year, month)
        );
        const fileContent = await readFile(filePath, 'utf-8');
        const rawData = parse(fileContent);

        // スキーマバリデーション
        const validation = monthDataSchema.safeParse(rawData);
        if (!validation.success) {
          logger.warn('Month data validation failed', {
            year,
            month,
            issues: validation.error.issues.length,
          });
        }

        const normalized = normalizeMonthData(rawData, year, month);
        if (normalized) {
          logger.debug('Loaded month data', { year, month, eventCount: normalized.events.length });
        }
        return normalized;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return null;
        }
        logger.error('Failed to load month data', error, { year, month });
        return null;
      }
    });
  }

  /**
   * 指定した年の全月別データを取得
   */
  async getAllMonthsForYear(year: Year): Promise<MonthData[]> {
    const months = await this.getAvailableMonths(year);
    const dataPromises = months.map((month) => this.getMonthData(year, month));
    const results = await Promise.all(dataPromises);
    return results.filter((data): data is MonthData => data !== null);
  }

  /**
   * 指定した年の全イベントを取得（日付順）
   */
  async getAllEventsForYear(year: Year): Promise<HistoryEvent[]> {
    const monthDataList = await this.getAllMonthsForYear(year);
    const allEvents = monthDataList.flatMap((monthData) => monthData.events);
    return allEvents.sort((a, b) => a.date.localeCompare(b.date));
  }
}

/**
 * デフォルトリポジトリインスタンス（シングルトン）
 */
let defaultRepository: IHistoryRepository | null = null;

/**
 * デフォルトリポジトリを取得
 */
export function getHistoryRepository(): IHistoryRepository {
  if (!defaultRepository) {
    defaultRepository = new FileSystemHistoryRepository();
  }
  return defaultRepository;
}

/**
 * テスト用: リポジトリをリセット
 */
export function resetHistoryRepository(): void {
  defaultRepository = null;
}
