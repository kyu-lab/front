import customAxios from "../utils/customAxios.js";

const API_URL = '/group';

export async function getGroups() {
  return await customAxios.get(`${API_URL}`);
}

export async function getGroup(groupId) {
  return await customAxios.get(`${API_URL}/${groupId}`);
}

export async function getUserGroupList(userId, cursor) {
  const requestUrl = cursor === null ? `${API_URL}/user/${userId}` : `${API_URL}/user/${userId}?cursor=${cursor}`;
  const response = await customAxios.get(requestUrl);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(`getUserkMarkPost 에러, status : ${response.status}, text : ${response.statusText}`);
}


export async function saveGroup(requestData) {
  return await customAxios.post(`${API_URL}`, requestData);
}

export async function updateGroup(requestData) {
  return await customAxios.put(`${API_URL}`, requestData);
}