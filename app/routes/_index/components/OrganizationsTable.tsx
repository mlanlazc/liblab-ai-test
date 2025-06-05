import { UniversalTableCard } from '@/components/building-blocks/universal-table-card/universal-table-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { LoaderComponent } from '@/components/building-blocks/loader-component/loader-component';

export const organizationsQuery = `
  SELECT organization_id, organization_name, industry, subscription_tier, created_at
  FROM organizations
  ORDER BY organization_name
  LIMIT $1
  OFFSET $2
`;

export const organizationsCountQuery = `
  SELECT COUNT(*) as total
  FROM organizations
`;

export interface OrganizationData {
  organization_id: string;
  organization_name: string;
  industry: string;
  subscription_tier: string;
  created_at: string;
}

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
            <TableHead>Organization Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Subscription Tier</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                <LoaderComponent />
              </TableCell>
            </TableRow>
          ) : organizations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No organizations found
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((org: OrganizationData) => (
              <TableRow key={org.organization_id}>
                <TableCell>{org.organization_name}</TableCell>
                <TableCell>{org.industry}</TableCell>
                <TableCell>{org.subscription_tier}</TableCell>
                <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </UniversalTableCard>
  );
}
