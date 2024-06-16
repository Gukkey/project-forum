import Head from "next/head"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <h1 className="font-montserrat font-bold text-black text-6xl text-center mb-6">
        Project Forum
      </h1>
      <div className="flex space-x-4">
        <button className="bg--500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Sign In
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Sign Up
        </button>
      </div>
    </div>
  )
}
