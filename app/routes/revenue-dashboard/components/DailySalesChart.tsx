import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UniversalChartCard } from '@/components/building-blocks/universal-chart-card/universal-chart-card';

export const dailySalesQuery = `
  SELECT date_trunc('day', s.sale_date) as sale_date,
         COUNT(s.sale_id) as transaction_count,
         SUM(s.total_amount) as daily_revenue
  FROM sales s
  WHERE s.sale_date >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY date_trunc('day', s.sale_date)
  ORDER BY sale_date DESC
`;

export type DailySalesData = {
  sale_date: string;
  transaction_count: number;
  daily_revenue: number;
};

interface DailySalesChartProps {
  data: DailySalesData[];
}

export function DailySalesChart({ data }: DailySalesChartProps) {
  const formattedData = data
    .map((item) => ({
      ...item,
      sale_date: new Date(item.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }))
    .reverse();

  const chartConfig = {
    daily_revenue: {
      label: 'Daily Revenue',
      color: 'var(--chart-5)',
    },
    transaction_count: {
      label: 'Transactions',
      color: 'var(--chart-6)',
    },
  };

  return (
    <UniversalChartCard
      title="Daily Sales Trends"
      description="Revenue and transaction volume for the last 30 days"
      chartConfig={chartConfig}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sale_date" />
          <YAxis
            yAxisId="left"
            orientation="left"
            tickFormatter={(value) =>
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
                maximumFractionDigits: 1,
              }).format(value)
            }
          />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="daily_revenue"
            stroke="var(--chart-5-stroke)"
            fill="var(--chart-5)"
            fillOpacity={0.6}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="transaction_count"
            stroke="var(--chart-6-stroke)"
            fill="var(--chart-6)"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </UniversalChartCard>
  );
}
