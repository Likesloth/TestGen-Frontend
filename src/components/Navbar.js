import Link from 'next/link';
import Button from './ui/button';

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
            BlackBoxTestGen
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
                <Button onClick={onLoginOpen} variant="primary" size="sm">
                  Sign in
                </Button>
                <Button onClick={onRegisterOpen} variant="secondary" size="sm">
                  Create account
                </Button>
              </>
            ) : (
              <>
                <span className="px-3 py-2 text-gray-700">
                  Hello, {currentUser}
                </span>
                <Button onClick={onLogout} variant="secondary" size="sm">
                  Sign out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
