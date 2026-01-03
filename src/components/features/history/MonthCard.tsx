'use client';

/**
 * 月リンクコンポーネント
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
 * 月リンクコンポーネント
 * タイムライン形式のシンプルなリンク
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
        'group flex items-center justify-between py-3',
        'border-b border-border last:border-b-0',
        'hover:bg-muted/30 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      aria-label={t.a11y.navigateToMonth(year, month)}
    >
      <span className="text-foreground group-hover:text-foreground/80">
        {monthName}
      </span>

      <div className="flex items-center gap-3">
        {hasEvents && (
          <span className="text-sm text-muted-foreground tabular-nums">
            {eventCount}件
          </span>
        )}
        <span
          className={cn(
            'text-muted-foreground transition-transform duration-200',
            'group-hover:translate-x-1'
          )}
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  );
}

/** メモ化された月カード */
export const MonthCard = memo(MonthCardComponent);

export default MonthCard;
