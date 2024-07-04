import { EditorProvider } from "@projectforum/context/editor"

export default function CreatePageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <EditorProvider>{children}</EditorProvider>
}
