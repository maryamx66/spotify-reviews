import { API_URL } from "./constants";
import { authenticated_fetch } from "./utilities";

export const me = async () => {
  let response = await authenticated_fetch(API_URL + "/me");

  if (response.status === 400) {
    return null;
  }
  return await response.json();
};

export const refreshToken = async () => {
  let response = await authenticated_fetch(API_URL + "/refresh");
  if (response.status !== 200) {
    return null;
  }
  let response_data = await response.json();
  localStorage.setItem("authToken", response_data.token);
  return await me();
};
