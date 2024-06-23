import Tiptap from "@projectforum/components/Tiptap"

export default function Test() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-xl font-bold">AITHER</div>
        <nav className="space-x-4">
          <a href="#" className="text-gray-300 hover:text-white">
            Movies
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Torrents
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Community
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Support
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Other
          </a>
        </nav>
      </header>
      <div className="flex-grow p-6">
        <nav className="text-gray-400 text-sm mb-4">
          <a href="#" className="hover:underline">
            Forums
          </a>{" "}
          {">"}
          <a href="#" className="hover:underline">
            {" "}
            Tech
          </a>{" "}
          {">"}
          <a href="#" className="hover:underline">
            {" "}
            New
          </a>
        </nav>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Create New Topic</h2>
          {/* <div className="mb-4">
                <input
                    type="text"
                    placeholder="Title of This Topic"
                    className="w-full bg-gray-700 text-gray-300 py-2 px-3 rounded"
                />
                </div> */}
          <div className="mb-4">
            <div className="flex border-b border-gray-600 mb-2">
              <button type="button" className="text-gray-300 py-2 px-4 bg-gray-700 rounded-tl-lg">
                Write
              </button>
              <button type="button" className="text-gray-300 py-2 px-4 bg-gray-700 rounded-tr-lg">
                Preview
              </button>
            </div>
            <Tiptap></Tiptap>
          </div>
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
            Save This Topic
          </button>
        </div>
      </div>
      {/* <footer className="bg-gray-800 p-6 text-sm">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Aither</h3>
            <p>Torrenting - Modernized</p>
            <img src="/path/to/logo.png" alt="Aither logo" className="mt-2" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Account</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  My Profile
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Logout
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Community</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Forums
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  News
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Wikis
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Pages</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Rules
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Upload Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  DMCA / Terms Of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  HowTo: Screenshots
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  [View All]
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Info</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Staff
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Internal
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Client Blacklist
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Releasegroup Blacklist
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Other</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Support UNIT3D Development
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Powered by UNIT3D
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center mt-4">
          This page took 0.014 seconds to render and 26.00 MB of memory
        </p>
      </footer> */}
    </div>
  )
}
