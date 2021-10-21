import { GetServerSideProps } from 'next';
import React from 'react';
import Can from '../components/can';
import setupAPIClient from '../services/api';
import withSSRAuth from '../utils/withSSRAuth';

interface Props {}

const MetricsPage = (props: Props) => {
  return (
    <div>
      <h1>Metrics</h1>

      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const res = await apiClient.get('/me');

    return {
      props: {},
    };
  },
  {
    permissions: ['metrics.list'],
    roles: ['administrator'],
  }
);

export default MetricsPage;
