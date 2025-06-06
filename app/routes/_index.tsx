import { useLoaderData, redirect } from '@remix-run/react';
import { ErrorComponent } from '@/components/building-blocks/error-component/error-component';
import OrganizationsPage, { loader as organizationsLoader } from './organizations';

export async function loader() {
  // Redirect to the organizations page as the new homepage
  return redirect('/organizations');
}

export default function Index() {
  // This component will not be rendered due to the redirect in the loader.
  // It's kept for consistency with Remix's _index.tsx structure.
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Redirecting...</h1>
    </main>
  );
}
