'use client';

/**
 * 年カードコンポーネント
 * @module components/features/history/YearCard
 */

import { memo, useMemo } from 'react';
import Link from 'next/link';
import type { Year } from '@/domain/types';
import { t } from '@/config/i18n';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Scroll, Swords, Factory, Rocket, Globe } from 'lucide-react';

/** 年カードのプロパティ */
export interface YearCardProps {
  /** 年 */
  readonly year: Year;
  /** イベント数（任意） */
  readonly eventCount?: number;
  /** 追加のクラス名 */
  readonly className?: string;
}

/** 時代の定義 */
interface Era {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  textColor: string;
}

/** 年から時代を判定 */
function getEra(year: number): Era {
  if (year < 1868) {
    return {
      name: '江戸',
      icon: Scroll,
      gradient: 'from-amber-500/10 via-transparent to-transparent',
      textColor: 'text-amber-600 dark:text-amber-400',
    };
  }
  if (year < 1912) {
    return {
      name: '明治',
      icon: Swords,
      gradient: 'from-red-500/10 via-transparent to-transparent',
      textColor: 'text-red-600 dark:text-red-400',
    };
  }
  if (year < 1945) {
    return {
      name: '大正・昭和前期',
      icon: Factory,
      gradient: 'from-slate-500/10 via-transparent to-transparent',
      textColor: 'text-slate-600 dark:text-slate-400',
    };
  }
  if (year < 1989) {
    return {
      name: '昭和後期',
      icon: Rocket,
      gradient: 'from-blue-500/10 via-transparent to-transparent',
      textColor: 'text-blue-600 dark:text-blue-400',
    };
  }
  return {
    name: '平成・令和',
    icon: Globe,
    gradient: 'from-violet-500/10 via-transparent to-transparent',
    textColor: 'text-violet-600 dark:text-violet-400',
  };
}

/**
 * 年カードコンポーネント
 * 年へのリンクをカード形式で表示（時代による視覚的区別付き）
 */
function YearCardComponent({
  year,
  eventCount,
  className,
}: YearCardProps) {
  const hasEvents = eventCount !== undefined && eventCount > 0;
  const era = useMemo(() => getEra(year), [year]);
  const EraIcon = era.icon;

  return (
    <Link
      href={`/${year}`}
      className={cn(
        'block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl',
        className
      )}
      aria-label={t.a11y.navigateToYear(year)}
    >
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          'hover:shadow-lg hover:-translate-y-1',
          'border-2 hover:border-primary/30',
          'group-focus-visible:ring-2 group-focus-visible:ring-ring'
        )}
      >
        {/* 時代グラデーション背景 */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-100 transition-opacity',
            era.gradient
          )}
          aria-hidden="true"
        />

        {/* コンテンツ */}
        <div className="relative p-5">
          <div className="flex items-start justify-between gap-4">
            {/* 左側: 年と時代 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <EraIcon
                  className={cn('size-5', era.textColor)}
                  aria-hidden="true"
                />
                <span className={cn('text-xs font-medium', era.textColor)}>
                  {era.name}
                </span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                {year}
                <span className="text-lg font-normal text-muted-foreground ml-1">
                  年
                </span>
              </h3>
            </div>

            {/* 右側: バッジと矢印 */}
            <div className="flex flex-col items-end gap-2">
              {hasEvents && (
                <Badge
                  variant="secondary"
                  className="text-xs tabular-nums"
                  aria-label={t.stats.eventsInYear(eventCount)}
                >
                  {eventCount}件
                </Badge>
              )}
              <div
                className={cn(
                  'size-8 rounded-full flex items-center justify-center',
                  'bg-secondary group-hover:bg-primary transition-colors'
                )}
              >
                <ChevronRight
                  className={cn(
                    'size-4 transition-all',
                    'text-muted-foreground group-hover:text-primary-foreground',
                    'group-hover:translate-x-0.5'
                  )}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

/** メモ化された年カード */
export const YearCard = memo(YearCardComponent);

export default YearCard;
