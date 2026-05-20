export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >
      <header
        style={{
          padding: "16px",
          background: "#111827",
          color: "#ffffff",
        }}
      >
        <strong>Prontus</strong>
      </header>

      <section
        style={{
          padding: "16px",
        }}
      >
        {children}
      </section>
    </main>
  );
}