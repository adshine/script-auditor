import { Toaster } from "sonner";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <main className="min-h-screen bg-background">
        {children}
      </main>
      <Toaster position="top-right" />
    </>
  );
} 