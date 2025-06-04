import { useLoaderData } from '@remix-run/react';
import { executePostgresQuery } from '@/db/execute-query';
import { WithErrorHandling } from '@/components/hoc/error-handling-wrapper/error-handling-wrapper';
import {
  OrganizationMetrics,
  OrganizationMetricsData,
  organizationMetricsQuery,
} from './revenue-dashboard/components/OrganizationMetrics';
import {
  RevenueSourcesChart,
  RevenueSourcesData,
  revenueSourcesQuery,
} from './revenue-dashboard/components/RevenueSourcesChart';
import {
  ProductCategoryChart,
  ProductCategoryData,
  productCategoryQuery,
} from './revenue-dashboard/components/ProductCategoryChart';
import {
  SubscriptionMetrics,
  SubscriptionMetricsData,
  subscriptionMetricsQuery,
} from './revenue-dashboard/components/SubscriptionMetrics';
import { DailySalesChart, DailySalesData, dailySalesQuery } from './revenue-dashboard/components/DailySalesChart';

export async function loader() {
  const [organizationMetrics, revenueSources, productCategories, subscriptionMetrics, dailySales] = await Promise.all([
    executePostgresQuery<OrganizationMetricsData>(organizationMetricsQuery),
    executePostgresQuery<RevenueSourcesData>(revenueSourcesQuery),
    executePostgresQuery<ProductCategoryData>(productCategoryQuery),
    executePostgresQuery<SubscriptionMetricsData>(subscriptionMetricsQuery),
    executePostgresQuery<DailySalesData>(dailySalesQuery),
  ]);

  return {
    organizationMetrics,
    revenueSources,
    productCategories,
    subscriptionMetrics,
    dailySales,
  };
}

export default function RevenueDashboard() {
  const { organizationMetrics, revenueSources, productCategories, subscriptionMetrics, dailySales } =
    useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Revenue Dashboard</h1>

      <WithErrorHandling
        queryData={organizationMetrics}
        render={(data) => <OrganizationMetrics data={data} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WithErrorHandling
          queryData={revenueSources}
          render={(data) => <RevenueSourcesChart data={data} />}
        />
        <WithErrorHandling
          queryData={productCategories}
          render={(data) => <ProductCategoryChart data={data} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WithErrorHandling
          queryData={subscriptionMetrics}
          render={(data) => <SubscriptionMetrics data={data} />}
        />
        <WithErrorHandling
          queryData={dailySales}
          render={(data) => <DailySalesChart data={data} />}
        />
      </div>
    </div>
  );
}
