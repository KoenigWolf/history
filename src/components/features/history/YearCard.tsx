'use client';

/**
 * 年カードコンポーネント
 * @module components/features/history/YearCard
 */

import { memo } from 'react';
import Link from 'next/link';
import type { Year } from '@/domain/types';
import { t } from '@/config/i18n';
import { cn } from '@/lib/utils';

/** 年カードのプロパティ */
export interface YearCardProps {
  /** 年 */
  readonly year: Year;
  /** イベント数（任意） */
  readonly eventCount?: number;
  /** 追加のクラス名 */
  readonly className?: string;
}

/**
 * 年カードコンポーネント
 * ミニマルなタイポグラフィ中心のデザイン
 */
function YearCardComponent({
  year,
  eventCount,
  className,
}: YearCardProps) {
  const hasEvents = eventCount !== undefined && eventCount > 0;

  return (
    <Link
      href={`/${year}`}
      className={cn(
        'group block',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-sm',
        className
      )}
      aria-label={t.a11y.navigateToYear(year)}
    >
      <article
        className={cn(
          'relative py-6 px-1',
          'border-b border-border',
          'transition-colors duration-200',
          'hover:bg-muted/30'
        )}
      >
        <div className="flex items-baseline justify-between gap-4">
          {/* 年 */}
          <h3 className="text-2xl font-light tracking-tight text-foreground tabular-nums">
            {year}
          </h3>

          {/* イベント数 */}
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
        </div>
      </article>
    </Link>
  );
}

/** メモ化された年カード */
export const YearCard = memo(YearCardComponent);

export default YearCard;
