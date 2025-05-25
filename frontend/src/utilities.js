/**
 * @param {string} url
 * @param {RequestInit | undefined} options
 */
export const authenticated_fetch = (url, options = {}) => {
  const currentToken = localStorage.getItem("authToken");

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      authorization: `Bearer ${currentToken}`,
    },
  });
};
