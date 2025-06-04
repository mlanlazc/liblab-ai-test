import { ChartSharePercentage } from '@/components/building-blocks/chart-share-percentage/chart-share-percentage';

export const subscriptionMetricsQuery = `
  SELECT s.plan_name,
         COUNT(s.subscription_id) as subscriber_count,
         SUM(s.monthly_price) as monthly_recurring_revenue
  FROM subscriptions s
  WHERE s.status = 'active'
  GROUP BY s.plan_name
  ORDER BY monthly_recurring_revenue DESC
`;

export type SubscriptionMetricsData = {
  plan_name: string;
  subscriber_count: number;
  monthly_recurring_revenue: number;
};

interface SubscriptionMetricsProps {
  data: SubscriptionMetricsData[];
}

export function SubscriptionMetrics({ data }: SubscriptionMetricsProps) {
  const totalMRR = data.reduce((sum, item) => sum + item.monthly_recurring_revenue, 0);
  const totalSubscribers = data.reduce((sum, item) => sum + item.subscriber_count, 0);

  const chartConfig = data.reduce(
    (acc, item) => ({
      ...acc,
      [item.plan_name]: {
        label: item.plan_name,
      },
    }),
    {},
  );

  return (
    <ChartSharePercentage
      title="Subscription Distribution"
      description="Active subscribers and MRR by plan"
      data={data}
      dataKey="monthly_recurring_revenue"
      nameKey="plan_name"
      chartConfig={chartConfig}
      centerValueRenderer={(data) => ({
        title: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(totalMRR),
        subtitle: `${totalSubscribers} subscribers`,
      })}
      valueFormatter={(value) =>
        new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(value / totalMRR)
      }
    />
  );
}
