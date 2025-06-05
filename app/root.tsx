import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import './tailwind.css';
import { ErrorComponent } from '@/components/building-blocks/error-component/error-component';
import { Layout } from '@/components/layout/layout';

export { links } from '@/components/layout/layout';

export function ErrorBoundary() {
  const error: Error = useRouteError() as Error;
  const loggedErrors = useRef<string[]>([]);

  useEffect(() => {
    if (import.meta.env.VITE_PROD || !error?.stack || loggedErrors.current.includes(error.stack)) {
      return;
    }

    console.error(error?.stack);
    loggedErrors.current.push(error.stack);
  }, [error]);

  if (import.meta.env.VITE_PROD) {
    return <ErrorComponent errorMessage="Something went wrong, please try to refresh the page." />;
  }

  return <pre>{error?.stack}</pre>;
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
