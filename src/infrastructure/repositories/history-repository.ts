/**
 * 歴史データリポジトリ
 * ファイルシステムからのデータ読み込みを抽象化
 * @module infrastructure/repositories/history-repository
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';

import { DATA_DIR_PATH, FILE_PATTERNS } from '@/config/constants';
import type { Year, Month, HistoryEvent, MonthData, YearData, Result } from '@/domain/types';
import { DataLoadError, DataParseError, NotFoundError } from '@/domain/errors';
import { monthDataSchema, yearDataSchema } from '@/domain/validation/schemas';
import { isValidYear, isValidMonth, createYear, createMonth, createDateString } from '@/domain/validation/validators';
import { withCache, cacheKeys } from '@/infrastructure/cache';

/** データディレクトリの絶対パス */
const DATA_DIR = join(process.cwd(), ...DATA_DIR_PATH);

/**
 * YAMLデータを正規化してドメイン型に変換
 */
function normalizeHistoryEvent(raw: Record<string, unknown>): HistoryEvent {
  return {
    date: createDateString(raw.date as string),
    title: raw.title as string,
    category: raw.category as string,
    description: raw.description as string,
    relatedCountries: (raw.related_countries as string[]) ?? [],
    sources: raw.sources as string[] | undefined,
  };
}

/**
 * 月別データを正規化
 */
function normalizeMonthData(raw: Record<string, unknown>, year: Year, month: Month): MonthData {
  const events = (raw.events as Record<string, unknown>[]) ?? [];
  return {
    year,
    month,
    events: events.map(normalizeHistoryEvent),
  };
}

/**
 * 年別データを正規化
 */
function normalizeYearData(raw: Record<string, unknown>, year: Year): YearData {
  return {
    year,
    summary: raw.summary as string | undefined,
    majorEvents: raw.majorEvents
      ? (raw.majorEvents as Record<string, unknown>[]).map(normalizeHistoryEvent)
      : undefined,
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
        return years;
      } catch (error) {
        console.error('Failed to read years directory:', error);
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

        return months;
      } catch (error) {
        console.error(`Failed to read months for year ${year}:`, error);
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
        const rawData = parse(fileContent) as Record<string, unknown>;

        // バリデーション（ログのみ、エラーは投げない）
        const validation = yearDataSchema.safeParse(rawData);
        if (!validation.success) {
          console.warn(`Year data validation warning for ${year}:`, validation.error.issues);
        }

        return normalizeYearData(rawData, year);
      } catch (error) {
        // ファイルが存在しない場合はnullを返す
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return null;
        }
        console.warn(`Failed to load year data for ${year}:`, error);
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
        const rawData = parse(fileContent) as Record<string, unknown>;

        // バリデーション（ログのみ）
        const validation = monthDataSchema.safeParse(rawData);
        if (!validation.success) {
          console.warn(`Month data validation warning for ${year}-${month}:`, validation.error.issues);
        }

        return normalizeMonthData(rawData, year, month);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return null;
        }
        console.warn(`Failed to load month data for ${year}-${month}:`, error);
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
