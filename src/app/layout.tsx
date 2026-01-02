/**
 * ルートレイアウト
 * @module app/layout
 */

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { APP_METADATA } from '@/config/constants';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

/** メタデータ設定 */
export const metadata: Metadata = {
  title: {
    default: APP_METADATA.TITLE_WITH_RANGE,
    template: `%s | ${APP_METADATA.TITLE}`,
  },
  description: APP_METADATA.DESCRIPTION,
  keywords: ['世界史', '年表', '歴史', '日本史', '1800年', '2025年'],
  authors: [{ name: 'History App' }],
  openGraph: {
    title: APP_METADATA.TITLE_WITH_RANGE,
    description: APP_METADATA.DESCRIPTION,
    type: 'website',
    locale: APP_METADATA.LOCALE,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** ビューポート設定 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

/** ルートレイアウトのプロパティ */
interface RootLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * ルートレイアウト
 * アプリケーション全体の共通レイアウトを定義
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={APP_METADATA.LOCALE} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
        >
          メインコンテンツへスキップ
        </a>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
