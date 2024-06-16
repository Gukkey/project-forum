export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: `
            linear-gradient(90deg, #F0F7F4 calc(22px - 2px), transparent 1%) center / 22px 22px,
            linear-gradient(#F0F7F4 calc(22px - 2px), transparent 1%) center / 22px 22px,
            #D2D6DB
          `
      }}
      className="min-h-screen">
      {children}
    </section>
  )
}
