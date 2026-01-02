/**
 * 404ページ
 * @module app/not-found
 */

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { t } from '@/config/i18n';
import { PageContainer } from '@/components/features';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * 404 Not Found ページ
 */
export default function NotFound() {
  return (
    <PageContainer>
      <Card className="max-w-md mx-auto mt-20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className="text-6xl font-bold text-muted-foreground/30 mb-4"
            aria-hidden="true"
          >
            404
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {t.error.notFound}
          </h1>
          <p className="text-muted-foreground mb-8">
            お探しのページは見つかりませんでした。
          </p>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="size-4 mr-2" aria-hidden="true" />
                戻る
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">
                <Home className="size-4 mr-2" aria-hidden="true" />
                ホームへ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
