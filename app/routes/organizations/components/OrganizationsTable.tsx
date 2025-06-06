import { UniversalTableCard } from '@/components/building-blocks/universal-table-card/universal-table-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { LoaderComponent } from '@/components/building-blocks/loader-component/loader-component';

export const organizationsQuery = `
  SELECT organization_id, organization_name, industry, address, phone, email, created_at, subscription_tier, last_payment_date, next_payment_date
  FROM organizations
  ORDER BY created_at DESC
  LIMIT $1
  OFFSET $2
`;

export const organizationsCountQuery = `
  SELECT COUNT(*) as total
  FROM organizations
`;

export type OrganizationData = {
  organization_id: number;
  organization_name: string;
  industry: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  subscription_tier: string;
  last_payment_date: string;
  next_payment_date: string;
};

export interface OrganizationCountData {
  total: number;
}

const ITEMS_PER_PAGE = 10;

interface OrganizationsTableProps {
  organizations: OrganizationData[];
  organizationsCount: number;
  isLoading: boolean;
  onFiltersChange?: (filters: { page: number }) => void;
}

export function OrganizationsTable({ organizations, organizationsCount, isLoading, onFiltersChange }: OrganizationsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onFiltersChange?.({ page });
  };

  const totalPages = organizationsCount > 0 ? Math.ceil(organizationsCount / ITEMS_PER_PAGE) : 0;

  const PaginationControls = (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );

  return (
    <UniversalTableCard
      title="Organizations"
      description="List of all organizations"
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
          ) : organizations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                No organizations found
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((org) => (
              <TableRow key={org.organization_id}>
                <TableCell>{org.organization_id}</TableCell>
                <TableCell>{org.organization_name}</TableCell>
                <TableCell>{org.industry}</TableCell>
                <TableCell>{org.address}</TableCell>
                <TableCell>{org.phone}</TableCell>
                <TableCell>{org.email}</TableCell>
                <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{org.subscription_tier}</TableCell>
                <TableCell>{org.last_payment_date ? new Date(org.last_payment_date).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{org.next_payment_date ? new Date(org.next_payment_date).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </UniversalTableCard>
  );
}
