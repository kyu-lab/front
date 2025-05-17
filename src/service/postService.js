import customAxios from "../utils/customAxios.js";

const API_URL = '/post';

export async function getPosts(cursor, order) {
  const requestUrl = cursor === null ? `${API_URL}?order=${order}` : `${API_URL}?cursor=${cursor}&order=${order}`;
  const response = await customAxios.get(requestUrl);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(`getPosts 에러, status : ${response.status}, text : ${response.statusText}`);
}

export async function getPost(postId) {
  const response = await customAxios.get(`${API_URL}/${postId}`);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(`getPost 에러, status : ${response.status}, text : ${response.statusText}`);
}

export async function savePost(createReq) {
  return await customAxios.post(`${API_URL}`, createReq);
}

export async function updatePost(updateReq) {
  return await customAxios.put(`${API_URL}`, updateReq);
}

export async function toggleLike(postId) {
  return await customAxios.put(`${API_URL}/${postId}/like`);
}

export async function deletePost(postId) {
  return await customAxios.delete(`${API_URL}/${postId}`);
}