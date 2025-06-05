import { useFetcher, useLoaderData } from '@remix-run/react';
import { ErrorComponent } from '@/components/building-blocks/error-component/error-component';
import { WithErrorHandling } from '@/components/hoc/error-handling-wrapper/error-handling-wrapper';
import { useEffect } from 'react';
import { executePostgresQuery, QueryData } from '@/db/execute-query';
import { LoaderError } from '@/types/loader-error';
import { OrganizationData, OrganizationsTable, organizationsCountQuery, OrganizationCountData } from './_index/components/OrganizationsTable';

export async function loader(): Promise<HomePageProps | LoaderError> {
  try {
    const organizationsCount = await executePostgresQuery<OrganizationCountData>(organizationsCountQuery);

    return {
      organizationsCount,
    };
  } catch (error) {
    console.error('Error in homepage loader:', error);
    return { error: error instanceof Error ? error.message : 'Failed to load homepage data' };
  }
}

interface HomePageProps {
  organizationsCount: QueryData<OrganizationCountData[]>;
}

export default function Index() {
  const { organizationsCount } = useLoaderData<typeof loader>();
  const organizationsFetcher = useFetcher<QueryData<{ organizations: OrganizationData[]; organizationsCount: number }>>();

  useEffect(() => {
    // Initial fetch for the first page of organizations
    organizationsFetcher.submit({ page: 1, limit: 10 }, { method: 'post', action: '/resources/organizations' });
  }, []);

  const handleOrganizationsTableFiltersChange = (filters: { page: number }): void => {
    organizationsFetcher.submit(
      {
        page: filters.page,
        limit: 10, // Keep limit consistent
      },
      { method: 'post', action: '/resources/organizations' },
    );
  };

  if ('error' in organizationsCount) {
    return <ErrorComponent errorMessage={organizationsCount.error} />;
  }

  return (
    <main className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to liblab</h1>

      <WithErrorHandling
        queryData={organizationsFetcher.data}
        render={(data) => (
          <OrganizationsTable
            organizations={data.organizations}
            organizationsCount={data.organizationsCount}
            isLoading={organizationsFetcher.state === 'submitting'}
            onFiltersChange={handleOrganizationsTableFiltersChange}
          />
        )}
      />
    </main>
  );
}
