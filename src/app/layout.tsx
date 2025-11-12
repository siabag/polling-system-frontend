import { Inter } from "next/font/google";
import "../styles/globals.css";
import { AuthProviderWrapper } from "@/src/components/auth/AuthProviderWrapper";
import EmotionRegistry from "@/src/theme/EmotionRegistry";

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
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      {/* Añade la clase 'body-with-bg' aquí */}
      <body className={`${inter.variable} font-sans body-with-bg`}>
        <EmotionRegistry>
          <AuthProviderWrapper>
            {children}
          </AuthProviderWrapper>
        </EmotionRegistry>
      </body>
    </html>
  );
}