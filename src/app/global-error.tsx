"use client"

import "../app/globals.css"

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="font-sans min-h-screen bg-gray-900 text-gray-300 w-full text-left p-6">
          <h2>Seems like you caught an 🐞</h2>
          <p>Digest: {error.digest}</p>
          <p>Cause: {String(error.cause)}</p>
          <p>Stack: {error.stack}</p>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  )
}
