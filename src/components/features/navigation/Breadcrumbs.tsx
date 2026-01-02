/**
 * パンくずナビゲーションコンポーネント
 * @module components/features/navigation/Breadcrumbs
 */

import Link from 'next/link';
import type { Year, Month } from '@/domain/types';
import { t } from '@/config/i18n';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/** パンくずナビゲーションのプロパティ */
export interface BreadcrumbsProps {
  /** 現在の年（任意） */
  readonly currentYear?: Year;
  /** 現在の月（任意） */
  readonly currentMonth?: Month;
  /** 追加のクラス名 */
  readonly className?: string;
}

/**
 * パンくずナビゲーション
 * 階層構造を明確に表示し、スクリーンリーダー対応
 */
export function Breadcrumbs({
  currentYear,
  currentMonth,
  className = 'mb-8',
}: BreadcrumbsProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {/* ホーム */}
        <BreadcrumbItem>
          {currentYear ? (
            <BreadcrumbLink asChild>
              <Link href="/" aria-label={t.a11y.navigateToYear(0)}>
                {t.nav.home}
              </Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{t.nav.home}</BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {/* 年 */}
        {currentYear && (
          <>
            <BreadcrumbSeparator aria-hidden="true" />
            <BreadcrumbItem>
              {currentMonth ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={`/${currentYear}`}
                    aria-label={t.a11y.navigateToYear(currentYear)}
                  >
                    {t.nav.year(currentYear)}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage aria-current="page">
                  {t.nav.year(currentYear)}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}

        {/* 月 */}
        {currentMonth && currentYear && (
          <>
            <BreadcrumbSeparator aria-hidden="true" />
            <BreadcrumbItem>
              <BreadcrumbPage aria-current="page">
                {t.nav.month(currentMonth)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
