'use client';

/**
 * 月カードコンポーネント
 * @module components/features/history/MonthCard
 */

import { memo } from 'react';
import Link from 'next/link';
import type { Year, Month } from '@/domain/types';
import { t, getMonthName } from '@/config/i18n';
import { cn } from '@/lib/utils';

/** 月カードのプロパティ */
export interface MonthCardProps {
  /** 年 */
  readonly year: Year;
  /** 月 */
  readonly month: Month;
  /** イベント数（任意） */
  readonly eventCount?: number;
  /** 追加のクラス名 */
  readonly className?: string;
}

/**
 * 月カードコンポーネント
 * クリーンなグリッドアイテムデザイン
 */
function MonthCardComponent({
  year,
  month,
  eventCount,
  className,
}: MonthCardProps) {
  const hasEvents = eventCount !== undefined && eventCount > 0;
  const monthName = getMonthName(month);

  return (
    <Link
      href={`/${year}/${month}`}
      className={cn(
        'group block',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 rounded-sm',
        className
      )}
      aria-label={t.a11y.navigateToMonth(year, month)}
    >
      <article
        className={cn(
          'relative p-5',
          'border border-border rounded-lg',
          'transition-all duration-200',
          'hover:border-foreground/20 hover:bg-muted/20'
        )}
      >
        <div className="flex items-start justify-between">
          {/* 月 */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              {month}月
            </p>
            <h4 className="text-lg font-medium text-foreground">
              {monthName}
            </h4>
          </div>

          {/* イベント数 */}
          {hasEvents && (
            <span className="text-xs text-muted-foreground tabular-nums pt-0.5">
              {eventCount}
            </span>
          )}
        </div>

        {/* ホバー時の矢印 */}
        <span
          className={cn(
            'absolute bottom-4 right-4',
            'text-muted-foreground/0 transition-all duration-200',
            'group-hover:text-muted-foreground'
          )}
          aria-hidden="true"
        >
          →
        </span>
      </article>
    </Link>
  );
}

/** メモ化された月カード */
export const MonthCard = memo(MonthCardComponent);

export default MonthCard;
