import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
export const viewport = {
  width: "device-width",
  initialScale: 1,
};