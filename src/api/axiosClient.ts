import axios from "axios";

export const createAxiosClient = (apiKey: string) =>
  axios.create({
    baseURL: "https://api.clickup.com/api/v2",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
  });
