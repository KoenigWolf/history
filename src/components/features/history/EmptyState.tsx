/**
 * 空状態コンポーネント
 * @module components/features/history/EmptyState
 */

import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, BookOpen, Calendar } from 'lucide-react';
import { t } from '@/config/i18n';

/** 空状態の種類 */
export type EmptyStateVariant = 'noData' | 'noYearData' | 'noMonthData';

/** 空状態コンポーネントのプロパティ */
export interface EmptyStateProps {
  /** 空状態の種類 */
  readonly variant: EmptyStateVariant;
  /** カスタムメッセージ（任意） */
  readonly message?: string;
  /** カスタムアイコン（任意） */
  readonly icon?: ReactNode;
  /** 追加のクラス名 */
  readonly className?: string;
}

/** バリアントごとのデフォルト設定 */
const variantConfig: Record<
  EmptyStateVariant,
  { message: string; icon: ReactNode }
> = {
  noData: {
    message: t.empty.noData,
    icon: <BookOpen className="size-12 text-muted-foreground/50" />,
  },
  noYearData: {
    message: t.empty.noYearData,
    icon: <Calendar className="size-12 text-muted-foreground/50" />,
  },
  noMonthData: {
    message: t.empty.noMonthData,
    icon: <FileText className="size-12 text-muted-foreground/50" />,
  },
};

/**
 * 空状態コンポーネント
 * データがない場合の表示を統一
 */
export function EmptyState({
  variant,
  message,
  icon,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const displayMessage = message ?? config.message;
  const displayIcon = icon ?? config.icon;

  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="mb-4" aria-hidden="true">
          {displayIcon}
        </div>
        <p className="text-muted-foreground text-center" role="status">
          {displayMessage}
        </p>
      </CardContent>
    </Card>
  );
}

export default EmptyState;
