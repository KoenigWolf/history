/**
 * 歴史データの読み込みユーティリティ
 * サーバーコンポーネント内でのみ使用可能
 */

import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';
import type { MonthData, YearData, HistoryEvent, YearMonth } from '@/types/history';

// データディレクトリのパス
const DATA_DIR = join(process.cwd(), 'src', 'data');

/**
 * 利用可能な年のリストを取得
 */
export async function getAvailableYears(): Promise<number[]> {
  try {
    const entries = await readdir(DATA_DIR, { withFileTypes: true });
    const years = entries
      .filter(entry => entry.isDirectory())
      .map(entry => parseInt(entry.name, 10))
      .filter(year => !isNaN(year))
      .sort((a, b) => a - b);
    return years;
  } catch (error) {
    console.error('Failed to read years directory:', error);
    return [];
  }
}

/**
 * 指定した年の月別ファイルのリストを取得
 */
export async function getAvailableMonths(year: number): Promise<number[]> {
  try {
    const yearDir = join(DATA_DIR, year.toString());
    const entries = await readdir(yearDir, { withFileTypes: true });
    const months = entries
      .filter(entry => {
        // 月別ファイル（YYYY-MM.yaml形式）のみを取得
        if (!entry.isFile()) return false;
        const match = entry.name.match(/^\d{4}-(\d{2})\.yaml$/);
        return match !== null;
      })
      .map(entry => {
        const match = entry.name.match(/^\d{4}-(\d{2})\.yaml$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((month): month is number => month !== null && month >= 1 && month <= 12)
      .sort((a, b) => a - b);
    return months;
  } catch (error) {
    console.error(`Failed to read months for year ${year}:`, error);
    return [];
  }
}

/**
 * 年別の概要データを読み込む
 */
export async function getYearData(year: number): Promise<YearData | null> {
  try {
    const filePath = join(DATA_DIR, year.toString(), `${year}.yaml`);
    const fileContent = await readFile(filePath, 'utf-8');
    const data = parse(fileContent) as YearData;
    return data;
  } catch (error) {
    // ファイルが存在しない場合はnullを返す
    console.warn(`Year data file not found for ${year}:`, error);
    return null;
  }
}

/**
 * 月別の詳細データを読み込む
 */
export async function getMonthData(year: number, month: number): Promise<MonthData | null> {
  try {
    const monthStr = month.toString().padStart(2, '0');
    const filePath = join(DATA_DIR, year.toString(), `${year}-${monthStr}.yaml`);
    const fileContent = await readFile(filePath, 'utf-8');
    const data = parse(fileContent) as MonthData;
    return data;
  } catch (error) {
    console.warn(`Month data file not found for ${year}-${month}:`, error);
    return null;
  }
}

/**
 * 複数の月別データを一度に読み込む
 */
export async function getMultipleMonthData(yearMonths: YearMonth[]): Promise<MonthData[]> {
  const dataPromises = yearMonths.map(({ year, month }) => getMonthData(year, month));
  const results = await Promise.all(dataPromises);
  return results.filter((data): data is MonthData => data !== null);
}

/**
 * 指定した年の全月別データを読み込む
 */
export async function getAllMonthsForYear(year: number): Promise<MonthData[]> {
  const months = await getAvailableMonths(year);
  const yearMonths: YearMonth[] = months.map(month => ({ year, month }));
  return getMultipleMonthData(yearMonths);
}

/**
 * 指定した年の全イベントを取得（全月を統合）
 */
export async function getAllEventsForYear(year: number): Promise<HistoryEvent[]> {
  const monthDataList = await getAllMonthsForYear(year);
  const allEvents: HistoryEvent[] = [];
  for (const monthData of monthDataList) {
    allEvents.push(...monthData.events);
  }
  // 日付順にソート
  return allEvents.sort((a, b) => a.date.localeCompare(b.date));
}
