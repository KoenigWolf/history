/**
 * 歴史イベントカードコンポーネント
 * @module components/features/history/EventCard
 */

import { memo } from 'react';
import type { HistoryEvent } from '@/domain/types';
import { t, formatDate } from '@/config/i18n';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/** イベントカードのプロパティ */
export interface EventCardProps {
  /** 表示するイベント */
  readonly event: HistoryEvent;
  /** 追加のクラス名 */
  readonly className?: string;
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
    <div className="space-y-2">
      <Separator />
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {t.event.relatedCountries}
        </p>
        <ul
          className="flex flex-wrap gap-1.5"
          aria-label={t.event.relatedCountries}
        >
          {countries.map((country, index) => (
            <li key={`${country}-${index}`}>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
              >
                {country}
              </Badge>
            </li>
          ))}
        </ul>
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
    <div className="space-y-2">
      <Separator />
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {t.event.sources}
        </p>
        <ul className="space-y-1" aria-label={t.event.sources}>
          {sources.map((source, index) => (
            <li
              key={`source-${index}`}
              className="text-xs text-muted-foreground"
            >
              • {source}
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
}: EventCardProps) {
  const formattedDate = formatDate(event.date);

  return (
    <Card
      className={`transition-shadow hover:shadow-md ${className ?? ''}`}
      role="article"
      aria-labelledby={`event-title-${event.date}-${event.title.slice(0, 10)}`}
    >
      <CardHeader>
        <CardDescription className="text-sm font-medium">
          <time dateTime={event.date} aria-label={t.a11y.eventDate(formattedDate)}>
            {formattedDate}
          </time>
        </CardDescription>
        <CardTitle
          id={`event-title-${event.date}-${event.title.slice(0, 10)}`}
          className="text-xl"
        >
          {event.title}
        </CardTitle>
        <CardAction>
          <Badge
            variant="secondary"
            aria-label={t.a11y.eventCategory(event.category)}
          >
            {event.category}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {event.description}
        </p>

        <RelatedCountriesSection countries={event.relatedCountries} />
        <SourcesSection sources={event.sources} />
      </CardContent>
    </Card>
  );
}

/** メモ化されたイベントカード */
export const EventCard = memo(EventCardComponent);

export default EventCard;
