/**
 * 歴史イベントを表示するカードコンポーネント
 */

import type { HistoryEvent } from '@/types/history';
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

interface EventCardProps {
  event: HistoryEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardDescription className="text-sm font-medium">
          {event.date}
        </CardDescription>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <CardAction>
          <Badge variant="secondary">{event.category}</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {event.description}
        </p>

        {event.related_countries.length > 0 && (
          <div className="space-y-2">
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                関連国・地域
              </p>
              <div className="flex flex-wrap gap-1.5">
                {event.related_countries.map((country, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                  >
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {event.sources && event.sources.length > 0 && (
          <div className="space-y-2">
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                参考文献
              </p>
              <ul className="space-y-1">
                {event.sources.map((source, index) => (
                  <li key={index} className="text-xs text-muted-foreground">
                    • {source}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
