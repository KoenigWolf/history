/**
 * 月へのリンクコンポーネント
 */

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface MonthLinkProps {
  year: number;
  month: number;
  eventCount?: number;
}

const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

export function MonthLink({ year, month, eventCount }: MonthLinkProps) {
  return (
    <Link href={`/${year}/${month}`} className="block group">
      <Card className="transition-all hover:shadow-md hover:border-primary/20 group-hover:bg-accent/50">
        <CardHeader className="flex-row items-center justify-between py-4">
          <CardTitle className="text-lg font-semibold">
            {monthNames[month - 1]}
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            {eventCount !== undefined && eventCount > 0 && (
              <Badge variant="secondary">{eventCount}件</Badge>
            )}
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
