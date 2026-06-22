import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="font-serif text-xl tracking-[0.2em] uppercase hover:text-accent transition-colors"
          >
            Luxury Motors
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}