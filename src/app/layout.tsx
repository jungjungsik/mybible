import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR, DM_Sans, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "나의 성경",
  description: "나만의 성경 앱",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/favicon.svg",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "나의 성경",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerifKr.variable} ${dmSans.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
      <head>
        {/* Blocking script to prevent dark mode FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('bible-dark-mode');
                  if (stored === 'true') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-serif bg-bible-bg dark:bg-bible-bg-dark text-bible-text dark:text-bible-text-dark antialiased">
        <ThemeProvider>
          <div className="max-w-3xl mx-auto min-h-screen pb-16">
            {children}
          </div>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
