import { EditorProvider } from "@projectforum/context/editor"

export default function TopicPageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <EditorProvider>{children}</EditorProvider>
}
