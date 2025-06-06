import { useFetcher } from '@remix-run/react';
import { executePostgresQuery, QueryData } from '@/db/execute-query';
import { LoaderError } from '@/types/loader-error';
import { WithErrorHandling } from '@/components/hoc/error-handling-wrapper/error-handling-wrapper';
import { useEffect } from 'react';
import { OrganizationData, OrganizationCountData, organizationsQuery, organizationsCountQuery, OrganizationsTable } from './organizations/components/OrganizationsTable';

export type OrganizationsCombinedData = {
  organizations: OrganizationData[];
  organizationsCount: number;
};

export async function loader(): Promise<QueryData<OrganizationsCombinedData> | LoaderError> {
  try {
    const [organizationsResult, organizationsCountResult] = await Promise.all([
      executePostgresQuery<OrganizationData>(organizationsQuery, ['10', '0']),
      executePostgresQuery<OrganizationCountData>(organizationsCountQuery),
    ]);

    if (organizationsResult.isError) {
      return organizationsResult;
    }
    if (organizationsCountResult.isError) {
      return organizationsCountResult;
    }

    return {
      isError: false,
      data: {
        organizations: organizationsResult.data,
        organizationsCount: organizationsCountResult.data[0]?.total || 0,
      },
    };
  } catch (error) {
    console.error('Error in organizations loader:', error);
    return { error: error instanceof Error ? error.message : 'Failed to load organizations data' };
  }
}

interface OrganizationsPageProps {
  organizationsData: QueryData<OrganizationsCombinedData>;
}

export default function OrganizationsPage({ organizationsData }: OrganizationsPageProps) {
  const organizationsFetcher = useFetcher<QueryData<OrganizationsCombinedData>>();

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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Organizations</h1>
      <WithErrorHandling
        queryData={organizationsFetcher.data || organizationsData}
        render={(data) => (
          <OrganizationsTable
            organizations={data.organizations || []}
            organizationsCount={data.organizationsCount || 0}
            isLoading={organizationsFetcher.state === 'submitting'}
            onFiltersChange={handleOrganizationsTableFiltersChange}
          />
        )}
      />
    </div>
  );
}
