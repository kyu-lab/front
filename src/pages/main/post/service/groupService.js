import customAxios from "../../../../utils/customAxios.js";

const API_URL = '/group';

export async function getGroup() {
  return await customAxios.get(`${API_URL}`);
}
