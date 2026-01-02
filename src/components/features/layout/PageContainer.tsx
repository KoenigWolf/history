/**
 * ページコンテナコンポーネント
 * @module components/features/layout/PageContainer
 */

import type { ReactNode } from 'react';

/** ページコンテナのプロパティ */
export interface PageContainerProps {
  /** ページコンテンツ */
  readonly children: ReactNode;
  /** 追加のクラス名 */
  readonly className?: string;
}

/**
 * ページコンテナコンポーネント
 * 共通のページレイアウトを提供
 */
export function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-background ${className ?? ''}`}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
