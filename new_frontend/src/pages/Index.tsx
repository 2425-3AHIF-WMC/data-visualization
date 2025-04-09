
import React from 'react';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Layout } from '../components/Layout';
import { HomeHero } from '../components/HomeHero';
import { useQuery } from '@tanstack/react-query';

const IndexPage = () => {
  // You can replace this with actual data fetching in the future
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      // For now, just return some sample data
      return null; // This will trigger the empty state
    },
  });

  const hasData = dashboardData !== null && !isLoading;

  return (
    <Layout 
      heroContent={<HomeHero hasData={hasData} />}
    >
      <Dashboard />
    </Layout>
  );
};

export default IndexPage;
