/**
 * ナビゲーションコンポーネント
 */

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface NavigationProps {
  currentYear?: number;
  currentMonth?: number;
}

export function Navigation({ currentYear, currentMonth }: NavigationProps) {
  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          {currentYear ? (
            <BreadcrumbLink asChild>
              <Link href="/">世界史年表</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>世界史年表</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {currentYear && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {currentMonth ? (
                <BreadcrumbLink asChild>
                  <Link href={`/${currentYear}`}>{currentYear}年</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{currentYear}年</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
        {currentMonth && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentMonth}月</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
