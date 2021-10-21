import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';

let isRefreshing = false;
let failedRequestQueue: any = [];

interface Props {
  ctx: undefined | GetServerSidePropsContext;
}

const setupAPIClient = (ctx = undefined) => {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`,
    },
  });

  api.interceptors.response.use(
    (res) => {
      return res;
    },
    (error: AxiosError | any) => {
      if (error.response?.status === 401) {
        if (error.response.data?.code === 'token.expired') {
          cookies = parseCookies();

          const { 'nextauth.refreshToken': refreshToken } = cookies;

          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post<any>('/refresh', {
                refreshToken,
              })
              .then((res) => {
                const { token } = res.data;

                setCookie(ctx, 'nextauth.token', token, {
                  maxAge: 60 * 60 * 24 * 30,
                  path: '/',
                });

                setCookie(ctx, 'nextauth.refreshToken', res.data.refreshToken, {
                  maxAge: 60 * 60 * 24 * 30,
                  path: '/',
                });

                api.defaults.headers.common[
                  'Authorization'
                ] = `Bearer ${token}`;

                failedRequestQueue.forEach((req: any) => req.onSuccess(token));
                failedRequestQueue = [];
              })
              .catch((error) => {
                failedRequestQueue.forEach((req: any) => req.onFailure(error));
                failedRequestQueue = [];

                if (process.browser) {
                  signOut();
                }
              })
              .finally(() => (isRefreshing = false));
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (error: AxiosError) => {
                reject(error);
              },
            });
          });
        } else {
          if (process.browser) {
            signOut();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default setupAPIClient;
