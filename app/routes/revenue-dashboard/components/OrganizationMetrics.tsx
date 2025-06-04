import { DollarSign } from 'lucide-react';
import { QuickInfoCard } from '@/components/building-blocks/quick-info-card/quick-info-card';

export const organizationMetricsQuery = `
  SELECT o.organization_name, 
         SUM(r.total_revenue) as total_revenue, 
         SUM(r.total_cost) as total_cost, 
         SUM(r.gross_profit) as gross_profit, 
         SUM(r.net_profit) as net_profit 
  FROM organizations o 
  JOIN revenue r ON o.organization_id = r.organization_id 
  GROUP BY o.organization_name 
  ORDER BY total_revenue DESC
`;

export type OrganizationMetricsData = {
  organization_name: string;
  total_revenue: number;
  total_cost: number;
  gross_profit: number;
  net_profit: number;
};

interface OrganizationMetricsProps {
  data: OrganizationMetricsData[];
}

export function OrganizationMetrics({ data }: OrganizationMetricsProps) {
  const totals = data.reduce(
    (acc, curr) => ({
      total_revenue: acc.total_revenue + curr.total_revenue,
      total_cost: acc.total_cost + curr.total_cost,
      gross_profit: acc.gross_profit + curr.gross_profit,
      net_profit: acc.net_profit + curr.net_profit,
    }),
    { total_revenue: 0, total_cost: 0, gross_profit: 0, net_profit: 0 },
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickInfoCard
        title="Total Revenue"
        description="Overall revenue across all organizations"
        icon={<DollarSign className="h-5 w-5 text-blue-500" />}
      >
        <div className="text-3xl font-bold">{formatCurrency(totals.total_revenue)}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="Total Cost"
        description="Combined costs and expenses"
        icon={<DollarSign className="h-5 w-5 text-red-500" />}
      >
        <div className="text-3xl font-bold">{formatCurrency(totals.total_cost)}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="Gross Profit"
        description="Revenue minus cost of goods sold"
        icon={<DollarSign className="h-5 w-5 text-green-500" />}
      >
        <div className="text-3xl font-bold">{formatCurrency(totals.gross_profit)}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="Net Profit"
        description="Final profit after all deductions"
        icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
      >
        <div className="text-3xl font-bold">{formatCurrency(totals.net_profit)}</div>
      </QuickInfoCard>
    </div>
  );
}
