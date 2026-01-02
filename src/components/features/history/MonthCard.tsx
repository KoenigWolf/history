'use client';

/**
 * 月カードコンポーネント
 * @module components/features/history/MonthCard
 */

import { memo, useMemo } from 'react';
import Link from 'next/link';
import type { Year, Month } from '@/domain/types';
import { t, getMonthName } from '@/config/i18n';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  Snowflake,
  Flower2,
  Sun,
  Leaf,
} from 'lucide-react';

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

/** 季節の定義 */
interface Season {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

/** 月から季節を判定 */
function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) {
    return {
      name: '春',
      icon: Flower2,
      bgColor: 'bg-pink-50 dark:bg-pink-950/30',
      iconColor: 'text-pink-500',
      borderColor: 'hover:border-pink-300 dark:hover:border-pink-700',
    };
  }
  if (month >= 6 && month <= 8) {
    return {
      name: '夏',
      icon: Sun,
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      iconColor: 'text-orange-500',
      borderColor: 'hover:border-orange-300 dark:hover:border-orange-700',
    };
  }
  if (month >= 9 && month <= 11) {
    return {
      name: '秋',
      icon: Leaf,
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      iconColor: 'text-amber-600',
      borderColor: 'hover:border-amber-300 dark:hover:border-amber-700',
    };
  }
  return {
    name: '冬',
    icon: Snowflake,
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    iconColor: 'text-sky-500',
    borderColor: 'hover:border-sky-300 dark:hover:border-sky-700',
  };
}

/**
 * 月カードコンポーネント
 * 月へのリンクをカード形式で表示（季節による視覚的区別付き）
 */
function MonthCardComponent({
  year,
  month,
  eventCount,
  className,
}: MonthCardProps) {
  const hasEvents = eventCount !== undefined && eventCount > 0;
  const monthName = getMonthName(month);
  const season = useMemo(() => getSeason(month), [month]);
  const SeasonIcon = season.icon;

  return (
    <Link
      href={`/${year}/${month}`}
      className={cn(
        'block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl',
        className
      )}
      aria-label={t.a11y.navigateToMonth(year, month)}
    >
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          'hover:shadow-md hover:-translate-y-0.5',
          'border hover:border-2',
          season.borderColor,
          'group-focus-visible:ring-2 group-focus-visible:ring-ring'
        )}
      >
        <div className="flex items-center gap-3 p-4">
          {/* 季節アイコン */}
          <div
            className={cn(
              'size-10 rounded-full flex items-center justify-center flex-shrink-0',
              season.bgColor
            )}
          >
            <SeasonIcon
              className={cn('size-5', season.iconColor)}
              aria-hidden="true"
            />
          </div>

          {/* 月名 */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-foreground truncate">
              {monthName}
            </h4>
            {hasEvents && (
              <p className="text-xs text-muted-foreground">
                {eventCount}件の出来事
              </p>
            )}
          </div>

          {/* 矢印 */}
          <ChevronRight
            className={cn(
              'size-5 flex-shrink-0 transition-all',
              'text-muted-foreground group-hover:text-foreground',
              'group-hover:translate-x-0.5'
            )}
            aria-hidden="true"
          />
        </div>

        {/* イベント数インジケーター */}
        {hasEvents && (
          <div className="h-1 bg-secondary">
            <div
              className={cn(
                'h-full transition-all duration-500',
                season.iconColor.replace('text-', 'bg-')
              )}
              style={{
                width: `${Math.min((eventCount / 10) * 100, 100)}%`,
              }}
              aria-hidden="true"
            />
          </div>
        )}
      </Card>
    </Link>
  );
}

/** メモ化された月カード */
export const MonthCard = memo(MonthCardComponent);

export default MonthCard;
