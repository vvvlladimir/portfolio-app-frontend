// api.ts
export type QueryParams = Record<
    string,
    string | number | boolean | undefined | null
>;

export const API_CONFIG = {
  baseURL: process.env.API_URL || "http://localhost:8000",
  endpoints: {
    transactions: {
      upload: (params?: QueryParams) =>
          getApiUrl("/upload/transactions/csv", params),
      get: (params?: QueryParams) => getApiUrl("/transactions", params),
    },
    positions: {
      snapshot: (params?: QueryParams) =>
          getApiUrl("/positions/snapshot", params),
      stats: (params?: QueryParams) => getApiUrl("/positions/stats", params),
      refresh: "/positions/refresh",
    },
    portfolio: {
      history: (params?: QueryParams) =>
          getApiUrl("/portfolio/history", params),
      weights: (params?: QueryParams) =>
          getApiUrl("/portfolio/weights", params),
      refresh: "/portfolio/refresh",
    },
    tickers: {
      get: (params?: QueryParams) => getApiUrl("/tickers", params),
      refresh: "/tickers/refresh",
    },
  },
}

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
}

const withParamsKey = (scope: string, params?: QueryParams | Record<string, unknown>) =>
    [scope, params ? JSON.stringify(params) : "{}"] as const

export const apiKeys = {
  portfolio: {
    root: ["portfolio"] as const,

    history: (params?: QueryParams) =>
        withParamsKey("portfolio/history", params),

    // get_last и любые другие query-параметры
    weights: (params?: QueryParams & { get_last?: boolean }) =>
        withParamsKey("portfolio/weights", params),

    refresh: ["portfolio/refresh"] as const,
  },

  positions: {
    snapshot: (params?: QueryParams) =>
        withParamsKey("positions/snapshot", params),
    stats: (params?: QueryParams) =>
        withParamsKey("positions/stats", params),
  },

  tickers: {
    get: (params?: QueryParams) => withParamsKey("tickers/get", params),
  },

  transactions: {
    get: (params?: QueryParams) => withParamsKey("transactions/get", params),
  },
}

export const isProduction = process.env.NODE_ENV === "production"
export const isDevelopment = process.env.NODE_ENV === "development"