'use client';
import { useState, useEffect } from "react";
import "./globals.css";
import { Header } from "./components/header";
import 'simplebar-react/dist/simplebar.min.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true)
  }, []);
  return (
    <html lang="en">
      <Header/>
      <body>{isClient ? <>{children}</> : null}</body>
    </html>
  );
}