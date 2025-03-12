import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientTemplate from "./template";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Travelovers",
  description: "Let's travel",
  icons: {
    icon: "/assets/travelogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <ClientTemplate>{children}</ClientTemplate>
      </body>
    </html>
  );
}
