import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
export const viewport = {
  width: "device-width",
  initialScale: 1,
};