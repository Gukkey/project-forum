import { InviteProvider } from "@projectforum/context/invite"

export default function SignUpLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <InviteProvider>{children}</InviteProvider>
}
