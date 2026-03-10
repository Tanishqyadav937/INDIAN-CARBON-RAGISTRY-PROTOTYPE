// API configuration utility
export const getApiUrl = (): string => {
  return (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';
};

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
