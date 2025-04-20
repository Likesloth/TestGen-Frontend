import Link from 'next/link';

export default function Navbar({
  isLoggedIn,
  currentUser,
  onLoginOpen,
  onRegisterOpen,
  onLogout
}) {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 hover:text-gray-900"
          >
            TestGen Web
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>

            {isLoggedIn && (
              <Link
                href="/history"
                className="px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                History
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <button
                  onClick={onLoginOpen}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterOpen}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <span className="px-3 py-2 text-gray-700">
                  Hello, {currentUser}
                </span>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
