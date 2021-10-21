import type { GetServerSideProps, NextPage } from 'next';
import { parseCookies } from 'nookies';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/Home.module.css';
import withSSRGuest from '../utils/withSSRGuest';

const Home: NextPage = () => {
  const [email, setEmail] = useState('diego@rocketseat.team');
  const [password, setPassword] = useState('123456');

  const { signIn, isAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h1>Hello World</h1>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = withSSRGuest(
  async (ctx) => {
    return {
      props: {},
    };
  }
);

export default Home;
