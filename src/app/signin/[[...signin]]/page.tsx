import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <main
      style={{
        background: `
          linear-gradient(90deg, #030711 calc(22px - 2px), transparent 100%) center / 22px 22px,
          linear-gradient(#030711 calc(22px - 2px), transparent 100%) center / 22px 22px,
          gray
        `
      }}
      className="min-h-screen min-w-screen grid place-items-center"
    >
      <SignIn />
    </main>
  )
}
