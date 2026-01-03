/**
 * セクションコンポーネント
 * @module components/features/layout/Section
 */

import type { ReactNode } from 'react';

/** セクションのプロパティ */
export interface SectionProps {
  /** セクションタイトル */
  readonly title: string;
  /** セクションコンテンツ */
  readonly children: ReactNode;
  /** 追加のクラス名 */
  readonly className?: string;
  /** タイトルのHTML要素（デフォルト: h2） */
  readonly titleAs?: 'h2' | 'h3' | 'h4';
  /** セクションの説明（任意） */
  readonly description?: string;
}

/**
 * セクションコンポーネント
 * シンプルなタイポグラフィベースのセクション
 */
export function Section({
  title,
  children,
  className = 'mb-12',
  titleAs: TitleTag = 'h2',
  description,
}: SectionProps) {
  return (
    <section className={className} aria-labelledby={`section-${title}`}>
      <TitleTag
        id={`section-${title}`}
        className="text-lg font-medium text-foreground mb-6"
      >
        {title}
      </TitleTag>
      {description && (
        <p className="text-muted-foreground mb-6 -mt-4">{description}</p>
      )}
      {children}
    </section>
  );
}

export default Section;
