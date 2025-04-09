import customAxios from "../utils/customAxios.js";

const SEARCH_API_URL = "/search";

export async function doSearch(query) {
  return await customAxios.get(`${SEARCH_API_URL}?q=${query}`);
}
