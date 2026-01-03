/**
 * ページヘッダーコンポーネント
 * @module components/features/layout/PageHeader
 */

import type { ReactNode } from 'react';

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
 * シンプルなタイポグラフィベースのヘッダー
 */
export function PageHeader({
  title,
  description,
  badge,
  children,
  className = 'mb-12',
}: PageHeaderProps) {
  return (
    <header className={className}>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {badge && (
        <p className="mt-2 text-sm text-muted-foreground">
          {badge}
        </p>
      )}
      {description && (
        <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
      {children}
    </header>
  );
}

export default PageHeader;
