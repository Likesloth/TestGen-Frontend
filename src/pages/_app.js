import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/ToastProvider";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {/* Global Skip Link for keyboard users */}
        <a
          href="#main"
          className="sr-only sr-only-focusable"
        >
          Skip to content
        </a>
        <Component {...pageProps} />
      </ToastProvider>
    </AuthProvider>
  );
}
