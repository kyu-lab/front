import customAxios from "../utils/customAxios.js";

const API_URL = '/notices'

export async function getPastNotices(userId) {
  return await customAxios.get(`${API_URL}/${userId}`);
}

export async function deleteNotices(noticesId) {
  return await customAxios.delete(`${API_URL}/read/${noticesId}/notices`);
}
