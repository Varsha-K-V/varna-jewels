
import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Varna Jewels",
  description: "Luxury Jewellery Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
