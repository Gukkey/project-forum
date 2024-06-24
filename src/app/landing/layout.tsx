export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: `
          linear-gradient(90deg, #030711 calc(22px - 2px), transparent 100%) center / 22px 22px,
          linear-gradient(#030711 calc(22px - 2px), transparent 100%) center / 22px 22px,
          gray
        `
      }}
      className="min-h-screen  "
    >
      {children}
    </section>
  )
}
