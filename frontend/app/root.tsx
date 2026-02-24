import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { createPortal } from "react-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { GlobalQueryClient } from "~/query-client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { LogOut } from "lucide-react";

import type { Route } from "./+types/root";
import "./app.css";
import logoUrl from "./images/restaurants_logo.svg";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import { LoginPage } from "~/components/login-page";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="h-16 flex items-center justify-between px-4">
            <img src={logoUrl} alt="Restaurantier" className="h-10 w-auto" />
            <div id="user-menu" />
          </div>
        </header>

        <main className="flex-1">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const queryClient = GlobalQueryClient;

function UserMenu() {
  const { logout } = useAuth0();
  const container = document.getElementById("user-menu");
  if (!container) return null;

  return createPortal(
    <Button
      variant="ghost"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      <LogOut />
      Log Out
    </Button>,
    container,
  );
}

function AuthGate() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={() => loginWithRedirect()}
        onSignUp={() =>
          loginWithRedirect({
            authorizationParams: { screen_hint: "signup" },
          })
        }
      />
    );
  }

  return (
    <>
      <UserMenu />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    //TODO: move domain and clientId to environment variables
    <Auth0Provider
      domain="dev-st7fyesoyw203hre.us.auth0.com"
      clientId="FKKRoPtqSY8OGKef3qZ5eJVKEcua27Yo"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthGate />
      </QueryClientProvider>
    </Auth0Provider>
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
