import { useLoaderData } from '@remix-run/react';
import { executePostgresQuery, QueryData } from '@/db/execute-query';
import { WithErrorHandling } from '@/components/hoc/error-handling-wrapper/error-handling-wrapper';
import { UniversalTableCard } from '@/components/building-blocks/universal-table-card/universal-table-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useState } from 'react';
import { LoaderComponent } from '@/components/building-blocks/loader-component/loader-component';

// SQL Query
export const organizationsQuery = `
  SELECT organization_id, organization_name, industry, address, phone, email, created_at, subscription_tier, last_payment_date, next_payment_date
  FROM organizations
  ORDER BY created_at DESC
  LIMIT $1 OFFSET $2
`;

export const organizationsCountQuery = `
  SELECT COUNT(*) as total FROM organizations
`;

// Types
export type OrganizationData = {
  organization_id: number;
  organization_name: string;
  industry: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  subscription_tier: string;
  last_payment_date: string | null;
  next_payment_date: string | null;
};

export type OrganizationCountData = {
  total: number;
};

const ITEMS_PER_PAGE = 10;

// Loader function
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const [organizationsResult, countResult] = await Promise.all([
    executePostgresQuery<OrganizationData>(organizationsQuery, [ITEMS_PER_PAGE.toString(), offset.toString()]),
    executePostgresQuery<OrganizationCountData>(organizationsCountQuery),
  ]);

  return {
    organizationsResult,
    countResult,
    currentPage: page,
  };
}

// Component Props
interface OrganizationsTableProps {
  data: OrganizationData[];
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

// OrganizationsTable Component
function OrganizationsTable({ data, totalCount, currentPage, onPageChange, isLoading }: OrganizationsTableProps) {
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const PaginationControls = (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            aria-disabled={currentPage === 1 || isLoading}
            tabIndex={currentPage === 1 || isLoading ? -1 : undefined}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages || isLoading}
            tabIndex={currentPage === totalPages || isLoading ? -1 : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return (
    <UniversalTableCard
      title="Organizations"
      description="List of all organizations with their details."
      CardFooterComponent={PaginationControls}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Subscription Tier</TableHead>
            <TableHead>Last Payment</TableHead>
            <TableHead>Next Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                <LoaderComponent />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                No organizations found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((org) => (
              <TableRow key={org.organization_id}>
                <TableCell>{org.organization_id}</TableCell>
                <TableCell>{org.organization_name}</TableCell>
                <TableCell>{org.industry}</TableCell>
                <TableCell>{org.address}</TableCell>
                <TableCell>{org.phone}</TableCell>
                <TableCell>{org.email}</TableCell>
                <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{org.subscription_tier}</TableCell>
                <TableCell>{org.last_payment_date ? new Date(org.last_payment_date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{org.next_payment_date ? new Date(org.next_payment_date).toLocaleDateString() : 'N/A'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </UniversalTableCard>
  );
}

// Main Page Component
export default function OrganizationsPage() {
  const { organizationsResult, countResult, currentPage } = useLoaderData<typeof loader>();
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    window.location.href = url.toString(); // This will trigger a new loader call
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Organizations Overview</h1>
      <WithErrorHandling
        queryData={countResult}
        render={(countData) => (
          <WithErrorHandling
            queryData={organizationsResult}
            render={(organizationsData) => (
              <OrganizationsTable
                data={organizationsData}
                totalCount={countData[0]?.total || 0}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          />
        )}
      />
    </div>
  );
}
