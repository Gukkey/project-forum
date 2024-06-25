import { InviteProvider } from "@projectforum/context/invite"

export default function SignUpLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <InviteProvider>
      <section
        style={{
          background: `
          linear-gradient(90deg, #030711 calc(22px - 2px), transparent 100%) center / 22px 22px,
          linear-gradient(#030711 calc(22px - 2px), transparent 100%) center / 22px 22px,
          gray
     `
        }}
      >
        {children}
      </section>
    </InviteProvider>
  )
}
