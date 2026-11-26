import axios from "axios";

export const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export const http = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Purane pages (Login, Books, Users...) ke liye
export async function api(
  path: string,
  options: { method?: string; body?: any } = {},
) {
  try {
    const isForm = options.body instanceof FormData;
    const res = await http.request({
      url: path,
      method: options.method || "GET",
      data: isForm
        ? options.body
        : options.body
          ? JSON.parse(options.body)
          : undefined,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || err.message || "Something went wrong",
    );
  }
}
