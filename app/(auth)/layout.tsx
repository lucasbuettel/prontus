export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-surface-muted px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
