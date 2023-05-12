import axios, { AxiosInstance } from 'axios';
import pino from 'pino';
import { getCookie } from '../helpers/get-cookie';

class ApiService {
  private axios: AxiosInstance;
  private logger: pino.Logger;

  constructor() {
    this.axios = axios.create({
      timeout: 30000,
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });
    this.logger = pino();
    const logger = this.logger;

    this.axios.interceptors.response.use(
      function (response) {
        logger.info(
          {
            baseURL: response.config.baseURL,
            method: response.config.method,
            url: response.config.url,
            response: {
              status: response.status,
            },
          },
          "RequestService > response"
        );

        return response;
      },
      function (error) {
        logger.error(
          {
            code: error.code,
            baseURL: error.config?.baseURL,
            url: error.config?.url,
            method: error.config?.method,
          },
          "RequestService > response error"
        );

        return Promise.reject(error);
      }
    );
  }

  getAxios(): AxiosInstance {
    return this.axios;
  }
}

export const apiService = new ApiService();
