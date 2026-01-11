import { QueryClient } from "@tanstack/react-query";

/**
 * Global query client for the app.
 *
 * Should only be used outside of React components.
 * if you need to use it inside a React component, use the `useQueryClient` hook.
 */
export const GlobalQueryClient = new QueryClient();
