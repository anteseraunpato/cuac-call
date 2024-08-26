import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React, { Children, ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Ilumicall",
  description: "app de videollamadas",
  icons: {
    icon: '/images/logo.jpeg'
  }
};

const RootLayout = ({ children }: { children:ReactNode } ) => {
  return (
    <main>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>


    </main>
  )
}

export default RootLayout
