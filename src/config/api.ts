export type QueryParams = Record<
    string,
    string | number | boolean | undefined | null
>;


export const API_CONFIG = {
  baseURL: process.env.API_URL || "http://localhost:8000",
  endpoints: {
    transactions: {
      upload: "/upload/transactions/csv",
      get: (params?: QueryParams) =>
          getApiUrl("/transactions", params),
    },
    positions:{
      snapshot: (params?: QueryParams) =>
          getApiUrl("/positions/snapshot", params),
    },
    portfolio:{
      history: (params?: QueryParams) =>
          getApiUrl("/portfolio/history", params),
        weights: (params?: QueryParams) =>
            getApiUrl("/portfolio/weights", params),
    }
  },
};

export const getApiUrl = (endpoint: string, params?: QueryParams): string => {
  const base = API_CONFIG.baseURL.replace(/\/$/, "")
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

  if (!params) return `${base}${path}`

  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value))
    }
  })

  return `${base}${path}?${query.toString()}`
};

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
