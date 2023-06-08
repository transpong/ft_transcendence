import axios, { AxiosInstance } from 'axios';
import { getCookie } from '../helpers/get-cookie';
import { createStandaloneToast } from "@chakra-ui/react";
// import pino from 'pino';

class ApiService {
  private readonly axios: AxiosInstance;

  // private logger: pino.Logger;

  constructor() {
    this.axios = axios.create({
      timeout: 30000,
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });
    // this.logger = pino();
    // const logger = this.logger;

    const {toast} = createStandaloneToast();


    this.axios.interceptors.response.use(
        function (response) {
          // logger.info(
          //   {
          //     baseURL: response.config.baseURL,
          //     method: response.config.method,
          //     url: response.config.url,
          //     response: {
          //       status: response.status,
          //     },
          //   },
          //   "RequestService > response"
          // );

          return response;
        },
      function (error) {
        // logger.error(
        //   {
        //     code: error.code,
        //     baseURL: error.config?.baseURL,
        //     url: error.config?.url,
        //     method: error.config?.method,
        //   },
        //   "RequestService > response error"
        // );

        toast({
          title: error.response?.data?.message || error.message || 'Unhandled Error',
          status: error.response?.status && error.response?.status >= 400 && error.response?.status < 500 ? "warning" : "error",
          duration: 9000,
          isClosable: true,
        });

        return Promise.reject(error);
      }
    );
  }

  getAxios(): AxiosInstance {
    return this.axios;
  }
}

export const apiService = new ApiService();
