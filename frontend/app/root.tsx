import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Link } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { GlobalQueryClient } from "~/query-client";

import type { Route } from "./+types/root";
import "./app.css";
import logoUrl from "./images/contacts_logo.svg";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="container mx-auto h-16 flex items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoUrl} alt="Contacts" className="h-10 w-auto" />
              <span className="sr-only">Contacts</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <Link to="/contact-list" className="hover:underline">
                Contact List
              </Link>
              <Link to="/contact-us" className="hover:underline">
                Contact Us
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 flex-1">{children}</main>

        <footer className="border-t">
          <div className="container mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="Contacts" className="h-7 w-auto" />
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="contacts@example.com" className="hover:underline">
                contacts@example.com
              </a>
              <a href="tel:132434" className="hover:underline">
                1300 345 678
              </a>
            </div>
          </div>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const queryClient = GlobalQueryClient;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
