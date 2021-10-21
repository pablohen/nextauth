import { GetServerSideProps } from 'next';
import { destroyCookie } from 'nookies';
import React, { useContext, useEffect } from 'react';
import Can from '../components/can';
import { AuthContext } from '../contexts/AuthContext';
import useCan from '../hooks/useCan';
import setupAPIClient from '../services/api';
import api from '../services/apiClient';
import withSSRAuth from '../utils/withSSRAuth';

interface Props {}

const DashboardPage = (props: Props) => {
  const { user, signOut } = useContext(AuthContext);

  const userCanSeeMetrics = useCan({
    permissions: ['metrics.list'],
  });

  useEffect(() => {
    api
      .get('/me')
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>

      <button onClick={signOut}>Sair</button>

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
    console.log(res.data);

    return {
      props: {},
    };
  }
);

export default DashboardPage;
