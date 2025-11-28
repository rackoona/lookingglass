import { apiClient } from '../client';
import { NetworkInfoResponse } from '../types';

export const network = {
  getNetworkInfo: async (baseUrl?: string) => {
    const config = baseUrl ? { baseURL: baseUrl } : undefined;
    const response = await apiClient.get<NetworkInfoResponse>('/network/info', config);
    return response.data;
  },
};

