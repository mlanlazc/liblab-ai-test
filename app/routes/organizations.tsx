import { useFetcher, useLoaderData } from '@remix-run/react';
import { executePostgresQuery, QueryData } from '@/db/execute-query';
import { LoaderError } from '@/types/loader-error';
import { WithErrorHandling } from '@/components/hoc/error-handling-wrapper/error-handling-wrapper';
import { useEffect } from 'react';
import { OrganizationData, OrganizationCountData, organizationsQuery, organizationsCountQuery, OrganizationsTable } from './organizations/components/OrganizationsTable';
import { ErrorComponent } from '@/components/building-blocks/error-component/error-component';

export async function loader(): Promise<OrganizationsPageProps | LoaderError> {
  try {
    const [organizations, organizationsCount] = await Promise.all([
      executePostgresQuery<OrganizationData>(organizationsQuery, ['10', '0']),
      executePostgresQuery<OrganizationCountData>(organizationsCountQuery),
    ]);

    return {
      organizations,
      organizationsCount,
    };
  } catch (error) {
    console.error('Error in organizations loader:', error);
    return { error: error instanceof Error ? error.message : 'Failed to load organizations data' };
  }
}

interface OrganizationsPageProps {
  organizations: QueryData<OrganizationData[]>;
  organizationsCount: QueryData<OrganizationCountData[]>;
}

export default function OrganizationsPage() {
  const data = useLoaderData<typeof loader>();

  if ('error' in data) {
    return <ErrorComponent errorMessage={data.error} />;
  }

  const { organizations, organizationsCount } = data;

  const organizationsFetcher = useFetcher<QueryData<{ organizations: OrganizationData[]; organizationsCount: number }>>();

  useEffect(() => {
    // Initial fetch is handled by the loader, but useFetcher can be used for subsequent updates
    // For initial load, we rely on the loader data.
    // This useEffect is primarily for demonstrating how useFetcher would be used for filtering/pagination.
    // The initial data is already available from the loader.
  }, []);

  const handleOrganizationsTableFiltersChange = (filters: { page: number }): void => {
    organizationsFetcher.submit(
      {
        page: filters.page,
        limit: 10, // Assuming 10 items per page
      },
      { method: 'post', action: '/resources/organizations' },
    );
  };

  const currentOrganizationsData = organizationsFetcher.data?.data?.organizations || organizations.data;
  const currentOrganizationsCount = organizationsFetcher.data?.data?.organizationsCount || organizationsCount.data?.[0]?.total;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Organizations</h1>
      <WithErrorHandling
        queryData={organizationsFetcher.data || organizations}
        render={(data) => (
          <OrganizationsTable
            organizations={currentOrganizationsData || []}
            organizationsCount={currentOrganizationsCount || 0}
            isLoading={organizationsFetcher.state === 'submitting'}
            onFiltersChange={handleOrganizationsTableFiltersChange}
          />
        )}
      />
    </div>
  );
}
