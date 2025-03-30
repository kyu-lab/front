import customAxios from "../../../../utils/customAxios.js";

const API_URL = '/comment';

export async function getComments(id) {
  const response = await customAxios.get(`${API_URL}/${id}`);
  if (response.status === 200) {
    return response.data;
  }
}

export async function saveComment(createReq) {
  return await customAxios.post(`${API_URL}`, createReq);
}
