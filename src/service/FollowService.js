import customAxios from "../utils/customAxios.js";

const API_URL = '/follow'

export async function getFollowUsers() {
  return await customAxios.get(`${API_URL}`);
}

export async function followUser(followerId) {
  return await customAxios.post(`${API_URL}/${followerId}`);
}

export async function unFollowUser(followerId) {
  return await customAxios.delete(`${API_URL}/${followerId}`);
}