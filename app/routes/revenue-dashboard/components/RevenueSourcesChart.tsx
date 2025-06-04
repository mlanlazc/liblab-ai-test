import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UniversalChartCard } from '@/components/building-blocks/universal-chart-card/universal-chart-card';

export const revenueSourcesQuery = `
  SELECT date_trunc('month', r.date) as month,
         SUM(r.subscription_revenue) as subscription_revenue,
         SUM(r.product_revenue) as product_revenue
  FROM revenue r
  GROUP BY date_trunc('month', r.date)
  ORDER BY month DESC
  LIMIT 12
`;

export type RevenueSourcesData = {
  month: string;
  subscription_revenue: number;
  product_revenue: number;
};

interface RevenueSourcesChartProps {
  data: RevenueSourcesData[];
}

export function RevenueSourcesChart({ data }: RevenueSourcesChartProps) {
  const formattedData = data
    .map((item) => ({
      ...item,
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    }))
    .reverse();

  const chartConfig = {
    subscription_revenue: {
      label: 'Subscription Revenue',
      color: 'var(--chart-1)',
    },
    product_revenue: {
      label: 'Product Revenue',
      color: 'var(--chart-2)',
    },
  };

  return (
    <UniversalChartCard
      title="Revenue Sources Over Time"
      description="Monthly breakdown of subscription vs product revenue"
      chartConfig={chartConfig}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
                maximumFractionDigits: 1,
              }).format(value)
            }
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="subscription_revenue"
            stackId="1"
            stroke="var(--chart-1-stroke)"
            fill="var(--chart-1)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="product_revenue"
            stackId="1"
            stroke="var(--chart-2-stroke)"
            fill="var(--chart-2)"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </UniversalChartCard>
  );
}
