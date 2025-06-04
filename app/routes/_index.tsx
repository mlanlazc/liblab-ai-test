import { useLoaderData } from '@remix-run/react';
import { ErrorComponent } from '@/components/building-blocks/error-component/error-component';
import RevenueDashboard, { loader as revenueDashboardLoader } from './revenue-dashboard';

export async function loader() {
  return revenueDashboardLoader();
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  if ('error' in data) {
    return <ErrorComponent errorMessage={data.error} />;
  }

  return <RevenueDashboard {...data} />;
}
