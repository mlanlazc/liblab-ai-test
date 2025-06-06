import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import { OrganizationData, OrganizationsTable } from '@/routes/organizations/components/OrganizationsTable';
import { QueryData } from '@/db/execute-query';
import { WithErrorHandling } from '@/components/hoc/error-handling-wrapper/error-handling-wrapper';

export default function OrganizationsPage() {
  const organizationsFetcher = useFetcher<QueryData<{ organizations: OrganizationData[]; organizationsCount: number }>>();

  useEffect(() => {
    organizationsFetcher.submit({ page: 1, limit: 10 }, { method: 'post', action: '/resources/organizations' });
  }, []);

  const handleOrganizationsTableFiltersChange = (filters: { page: number }): void => {
    organizationsFetcher.submit(
      {
        page: filters.page,
        limit: 10,
      },
      { method: 'post', action: '/resources/organizations' },
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Organizations</h1>
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
    </div>
  );
}
