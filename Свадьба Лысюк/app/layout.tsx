import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Данил & Софья · 07.09.2026",
  description: "Мы будем счастливы видеть вас рядом и провести этот праздник в кругу самых близких людей.",
  openGraph: {
    title: "Данил & Софья · 07.09.2026",
    description: "Свадебное приглашение · 7 сентября 2026",
    type: "website",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Данил & Софья — свадьба 07.09.2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Данил & Софья · 07.09.2026",
    description: "Свадебное приглашение · 7 сентября 2026",
    images: ["/og"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Inter:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* Anti-flash: apply theme before render */}
        <script dangerouslySetInnerHTML={{ __html:
          `(function(){try{var t=localStorage.getItem('wedding-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})()`
        }} />
      </head>
      <body>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
