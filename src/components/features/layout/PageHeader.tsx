/**
 * ページヘッダーコンポーネント
 * @module components/features/layout/PageHeader
 */

import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

/** ページヘッダーのプロパティ */
export interface PageHeaderProps {
  /** ページタイトル */
  readonly title: string;
  /** サブタイトル・説明文（任意） */
  readonly description?: string;
  /** バッジテキスト（任意） */
  readonly badge?: string;
  /** 追加コンテンツ（任意） */
  readonly children?: ReactNode;
  /** 追加のクラス名 */
  readonly className?: string;
}

/**
 * ページヘッダーコンポーネント
 * 各ページの見出しを統一的に表示
 */
export function PageHeader({
  title,
  description,
  badge,
  children,
  className = 'mb-10',
}: PageHeaderProps) {
  return (
    <header className={className}>
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {badge && (
          <Badge variant="secondary" className="text-sm">
            {badge}
          </Badge>
        )}
      </div>
      {description && (
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </header>
  );
}

export default PageHeader;
