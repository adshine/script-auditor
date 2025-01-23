import { Toaster } from "sonner";

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-h-[100vh] h-full w-full bg-white">
      {children}
    </main>
  );
} 