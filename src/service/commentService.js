import customAxios from "../utils/customAxios.js";

const API_URL = '/comment';

export async function getComments(id, cursor, order) {
  const requestUrl = cursor === null ? `${API_URL}?postId=${id}&order=${order}` : `${API_URL}?postId=${id}&cursor=${cursor}&order=${order}`;
  const response = await customAxios.get(requestUrl);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(`getComments 에러, status : ${response.status}, text : ${response.statusText}`);
}

export async function getChildComments(id, parentId, cursor) {
  const requestUrl = cursor === null ? `${API_URL}/child?postId=${id}&parentId=${parentId}` : `${API_URL}/child?postId=${id}&parentId=${parentId}&cursor=${cursor}`;
  const response = await customAxios.get(requestUrl);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(`getChildComments 에러, status : ${response.status}, text : ${response.statusText}`);
}

export async function saveComment(createReq) {
  return await customAxios.post(`${API_URL}`, createReq);
}
