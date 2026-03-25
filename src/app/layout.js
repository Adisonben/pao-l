import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalSoundProvider } from "@/hooks/useGlobalSound";
import { KioskProvider } from "@/context/KioskContext";
import ModeOverlay from "./ModeOverlay";
import ScreenSaver from "./components/ScreenSaver";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PAO AL — Alcohol Breath Test Station",
  description: "ตรวจวัดระดับแอลกอฮอล์ก่อนขับรถ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalSoundProvider>
          <KioskProvider>
            {children}
            {/* <ScreenSaver /> */}
            <ModeOverlay />
          </KioskProvider>
        </GlobalSoundProvider>
      </body>
    </html>
  );
}
