'use client';

/**
 * 歴史イベントカードコンポーネント
 * @module components/features/history/EventCard
 */

import { memo, useMemo } from 'react';
import type { HistoryEvent } from '@/domain/types';
import { t, formatDate } from '@/config/i18n';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Globe2,
  BookOpen,
  Swords,
  Landmark,
  Lightbulb,
  Users,
  AlertTriangle,
  MoreHorizontal,
  MapPin,
  FileText,
} from 'lucide-react';

/** イベントカードのプロパティ */
export interface EventCardProps {
  /** 表示するイベント */
  readonly event: HistoryEvent;
  /** 追加のクラス名 */
  readonly className?: string;
  /** コンパクト表示 */
  readonly compact?: boolean;
}

/** カテゴリスタイルの定義 */
interface CategoryStyle {
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  textColor: string;
  borderColor: string;
  badgeBg: string;
}

/** カテゴリからスタイルを取得 */
function getCategoryStyle(category: string): CategoryStyle {
  const styles: Record<string, CategoryStyle> = {
    '政治・経済': {
      icon: Landmark,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-l-blue-500',
      badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    },
    '戦争・紛争': {
      icon: Swords,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-l-red-500',
      badgeBg: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    },
    '文化': {
      icon: BookOpen,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-l-purple-500',
      badgeBg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    },
    '科学・技術': {
      icon: Lightbulb,
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-l-amber-500',
      badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    },
    '社会': {
      icon: Users,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-l-green-500',
      badgeBg: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    },
    '災害': {
      icon: AlertTriangle,
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-l-orange-500',
      badgeBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    },
    '外交': {
      icon: Globe2,
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      borderColor: 'border-l-cyan-500',
      badgeBg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    },
  };

  return styles[category] ?? {
    icon: MoreHorizontal,
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-600 dark:text-gray-400',
    borderColor: 'border-l-gray-500',
    badgeBg: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };
}

/**
 * 関連国・地域セクション
 */
function RelatedCountriesSection({
  countries,
}: {
  readonly countries: readonly string[];
}) {
  if (countries.length === 0) return null;

  return (
    <div className="flex items-start gap-2 pt-3 border-t border-border/50">
      <MapPin
        className="size-4 text-muted-foreground mt-0.5 flex-shrink-0"
        aria-hidden="true"
      />
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">
          {t.event.relatedCountries}
        </p>
        <div className="flex flex-wrap gap-1.5" role="list">
          {countries.map((country, index) => (
            <Badge
              key={`${country}-${index}`}
              variant="outline"
              className="text-xs bg-background"
            >
              {country}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 参考文献セクション
 */
function SourcesSection({
  sources,
}: {
  readonly sources?: readonly string[];
}) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="flex items-start gap-2 pt-3 border-t border-border/50">
      <FileText
        className="size-4 text-muted-foreground mt-0.5 flex-shrink-0"
        aria-hidden="true"
      />
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {t.event.sources}
        </p>
        <ul className="text-xs text-muted-foreground space-y-0.5">
          {sources.map((source, index) => (
            <li key={`source-${index}`} className="flex items-center gap-1">
              <span className="size-1 rounded-full bg-muted-foreground/50" />
              {source}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * 歴史イベントカード
 * イベントの詳細情報を構造化して表示
 */
function EventCardComponent({
  event,
  className,
  compact = false,
}: EventCardProps) {
  const formattedDate = formatDate(event.date);
  const categoryStyle = useMemo(
    () => getCategoryStyle(event.category),
    [event.category]
  );
  const CategoryIcon = categoryStyle.icon;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        'hover:shadow-lg',
        'border-l-4',
        categoryStyle.borderColor,
        className
      )}
      role="article"
      aria-labelledby={`event-title-${event.date}-${event.title.slice(0, 10)}`}
    >
      {/* ヘッダー部分 */}
      <div
        className={cn(
          'px-5 py-4',
          categoryStyle.bgColor
        )}
      >
        <div className="flex items-start justify-between gap-4">
          {/* 左側: 日付とタイトル */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* 日付 */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <time
                dateTime={event.date}
                className="font-medium text-muted-foreground"
              >
                {formattedDate}
              </time>
            </div>

            {/* タイトル */}
            <h3
              id={`event-title-${event.date}-${event.title.slice(0, 10)}`}
              className="text-xl font-bold text-foreground leading-tight"
            >
              {event.title}
            </h3>
          </div>

          {/* 右側: カテゴリバッジ */}
          <Badge
            className={cn(
              'flex items-center gap-1.5 flex-shrink-0',
              categoryStyle.badgeBg
            )}
          >
            <CategoryIcon className="size-3.5" aria-hidden="true" />
            <span>{event.category}</span>
          </Badge>
        </div>
      </div>

      {/* コンテンツ部分 */}
      <CardContent className="p-5 space-y-4">
        {/* 説明文 */}
        <p className={cn(
          'text-muted-foreground leading-relaxed',
          compact && 'line-clamp-3'
        )}>
          {event.description}
        </p>

        {/* メタ情報 */}
        {!compact && (
          <div className="space-y-3">
            <RelatedCountriesSection countries={event.relatedCountries} />
            <SourcesSection sources={event.sources} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** メモ化されたイベントカード */
export const EventCard = memo(EventCardComponent);

export default EventCard;
