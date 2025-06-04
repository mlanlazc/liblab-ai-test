import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UniversalChartCard } from '@/components/building-blocks/universal-chart-card/universal-chart-card';

export const productCategoryQuery = `
  SELECT p.category,
         COUNT(si.sale_item_id) as items_sold,
         SUM(si.total_price) as total_revenue
  FROM products p
  JOIN sale_items si ON p.product_id = si.product_id
  GROUP BY p.category
  ORDER BY total_revenue DESC
`;

export type ProductCategoryData = {
  category: string;
  items_sold: number;
  total_revenue: number;
};

interface ProductCategoryChartProps {
  data: ProductCategoryData[];
}

export function ProductCategoryChart({ data }: ProductCategoryChartProps) {
  const chartConfig = {
    total_revenue: {
      label: 'Revenue',
      color: 'var(--chart-3)',
    },
    items_sold: {
      label: 'Items Sold',
      color: 'var(--chart-4)',
    },
  };

  return (
    <UniversalChartCard
      title="Revenue by Product Category"
      description="Performance analysis by product category"
      chartConfig={chartConfig}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
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
          <Bar
            yAxisId="left"
            dataKey="total_revenue"
            fill="var(--chart-3)"
            stroke="var(--chart-3-stroke)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="items_sold"
            fill="var(--chart-4)"
            stroke="var(--chart-4-stroke)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </UniversalChartCard>
  );
}
