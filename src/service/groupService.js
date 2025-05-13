import customAxios from "../utils/customAxios.js";

const API_URL = '/group';

export async function getGroups() {
  return await customAxios.get(`${API_URL}`);
}

export async function getGroup(groupId) {
  return await customAxios.get(`${API_URL}/${groupId}`);
}

export async function saveGroup(requestData) {
  return await customAxios.post(`${API_URL}`, requestData);
}

export async function updateGroup(requestData) {
  return await customAxios.put(`${API_URL}`, requestData);
}