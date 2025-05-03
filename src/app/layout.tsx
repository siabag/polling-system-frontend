import { Inter } from "next/font/google";
import "../styles/globals.css";
import { AuthProviderWrapper } from "@/src/components/auth/AuthProviderWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Sistema de Encuestas para Cultivos de Café",
  description: "Plataforma para la gestión y análisis de encuestas relacionadas con cultivos de café",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans`}>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}