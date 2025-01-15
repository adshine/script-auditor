import { Toaster } from "sonner";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <main className="min-h-screen h-screen w-screen bg-background overflow-hidden">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
      <Toaster position="top-right" />
    </>
  );
} 