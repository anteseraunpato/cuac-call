import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import 'react-datepicker/dist/react-datepicker.css'

import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Ilumicall",
  description: "app de videollamadas",
  icons: {
    icon: '/images/logo.jpeg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider
    appearance={{
      layout: {
        logoImageUrl: '/images/logo.jpeg',
        socialButtonsVariant: 'iconButton',
      },

      variables: {
        colorText: '#ffffff',
        colorPrimary: '#0E78F9',
        colorBackground: '#1c1f2e',
        colorInputBackground: '#252a41',
        colorInputText: '#fff'
      }
    }}
    >
    <html lang="en">      
      <body className={'${inter.className} bg-dark-2'}>{children}
      <Toaster />
      </body>
      </html>
      </ClerkProvider>
  );
}
