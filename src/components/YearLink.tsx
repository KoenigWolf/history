/**
 * 年へのリンクコンポーネント
 */

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface YearLinkProps {
  year: number;
  eventCount?: number;
}

export function YearLink({ year, eventCount }: YearLinkProps) {
  return (
    <Link href={`/${year}`} className="block group">
      <Card className="transition-all hover:shadow-md hover:border-primary/20 group-hover:bg-accent/50">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{year}年</CardTitle>
          <CardAction className="flex items-center gap-2">
            {eventCount !== undefined && eventCount > 0 && (
              <Badge variant="secondary">{eventCount}件</Badge>
            )}
            <ChevronRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
