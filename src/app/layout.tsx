import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientTemplate from "./template";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
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
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <Navbar />
        <ClientTemplate>{children}</ClientTemplate>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}

