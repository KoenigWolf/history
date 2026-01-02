/**
 * キャッシュユーティリティ
 * @module infrastructure/cache
 */

/**
 * シンプルなメモリキャッシュ実装
 * サーバーサイドでの静的生成時に使用
 */
class MemoryCache<T> {
  private cache = new Map<string, { value: T; expiry: number }>();
  private readonly defaultTtl: number;

  constructor(defaultTtlMs: number = 5 * 60 * 1000) {
    this.defaultTtl = defaultTtlMs;
  }

  /**
   * キャッシュから値を取得
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * キャッシュに値を設定
   */
  set(key: string, value: T, ttlMs?: number): void {
    const expiry = Date.now() + (ttlMs ?? this.defaultTtl);
    this.cache.set(key, { value, expiry });
  }

  /**
   * キャッシュから値を削除
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * キャッシュをクリア
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * キャッシュのサイズを取得
   */
  get size(): number {
    return this.cache.size;
  }
}

/**
 * 歴史データ用キャッシュインスタンス
 * ビルド時のみ有効（ランタイムでは再生成される）
 */
export const historyDataCache = new MemoryCache<unknown>(10 * 60 * 1000);

/**
 * キャッシュキーを生成
 */
export const cacheKeys = {
  years: () => 'years',
  yearData: (year: number) => `year:${year}`,
  monthData: (year: number, month: number) => `month:${year}-${month}`,
  availableMonths: (year: number) => `months:${year}`,
} as const;

/**
 * キャッシュ付きデータ取得ヘルパー
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs?: number
): Promise<T> {
  const cached = historyDataCache.get(key) as T | undefined;
  if (cached !== undefined) {
    return cached;
  }

  const data = await fetcher();
  historyDataCache.set(key, data, ttlMs);
  return data;
}
