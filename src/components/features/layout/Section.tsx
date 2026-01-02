/**
 * セクションコンポーネント
 * @module components/features/layout/Section
 */

import type { ReactNode } from 'react';

/** セクションのプロパティ */
export interface SectionProps {
  /** セクションタイトル */
  readonly title: string;
  /** タイトルの前に表示するアイコン（任意） */
  readonly icon?: ReactNode;
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
 * コンテンツを論理的にグループ化して表示
 */
export function Section({
  title,
  icon,
  children,
  className = 'mb-12',
  titleAs: TitleTag = 'h2',
  description,
}: SectionProps) {
  return (
    <section className={className} aria-labelledby={`section-${title}`}>
      <div className="flex items-center gap-2 mb-6">
        {icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <TitleTag
          id={`section-${title}`}
          className="text-2xl font-semibold text-foreground"
        >
          {title}
        </TitleTag>
      </div>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      {children}
    </section>
  );
}

export default Section;
