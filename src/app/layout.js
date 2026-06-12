import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Killin Kutz | Premium Men's Grooming Lounge - Chembur Mumbai",
  description: "Mumbai's premier luxury men's grooming lounge. Expert haircuts, beard styling, facials & VIP packages in Chembur. Book your executive session today.",
  metadataBase: new URL("https://killinkutz.com"),
  keywords: ["best salon chembur", "men's haircut mumbai", "beard styling chembur", "luxury grooming mumbai", "killin kutz"],
  authors: [{ name: "Killin Kutz Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  manifest: "/manifest.json",
  openGraph: {
    title: "Killin Kutz - Premium Men's Grooming",
    description: "Mumbai's finest grooming lounge. Book now.",
    url: "https://killinkutz.com",
    siteName: "Killin Kutz",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import WhatsAppButton from "@/components/WhatsAppButton";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Set up Google Fonts fallback in stylesheet */}
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-luxury-black text-luxury-light font-sans selection:bg-gold-500 selection:text-luxury-black">
        <AuthProvider>
          <ThemeProvider>
            {children}
            <WhatsAppButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
