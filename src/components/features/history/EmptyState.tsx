/**
 * 空状態コンポーネント
 * @module components/features/history/EmptyState
 */

import { t } from '@/config/i18n';
import { cn } from '@/lib/utils';

/** 空状態の種類 */
export type EmptyStateVariant = 'noData' | 'noYearData' | 'noMonthData';

/** 空状態コンポーネントのプロパティ */
export interface EmptyStateProps {
  /** 空状態の種類 */
  readonly variant: EmptyStateVariant;
  /** カスタムメッセージ（任意） */
  readonly message?: string;
  /** 追加のクラス名 */
  readonly className?: string;
}

/** バリアントごとのメッセージ */
const variantMessages: Record<EmptyStateVariant, string> = {
  noData: t.empty.noData,
  noYearData: t.empty.noYearData,
  noMonthData: t.empty.noMonthData,
};

/**
 * 空状態コンポーネント
 * シンプルなテキスト表示
 */
export function EmptyState({
  variant,
  message,
  className,
}: EmptyStateProps) {
  const displayMessage = message ?? variantMessages[variant];

  return (
    <div
      className={cn(
        'py-16 text-center',
        className
      )}
      role="status"
    >
      <p className="text-muted-foreground">
        {displayMessage}
      </p>
    </div>
  );
}

export default EmptyState;
