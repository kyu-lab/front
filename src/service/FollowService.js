import customAxios from "../utils/customAxios.js";

const API_URL = '/follow'

export async function getFollower(userId, cursor) {
  const requestUrl = cursor === null ? `${API_URL}/${userId}/follower` : `${API_URL}/${userId}/follower?cursor=${cursor}`;
  const response = await customAxios.get(requestUrl);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(`getUserPosts 에러, status : ${response.status}, text : ${response.statusText}`);
}

export async function getFollowing(userId, cursor) {
  const requestUrl = cursor === null ? `${API_URL}/${userId}/following` : `${API_URL}/${userId}/following?cursor=${cursor}`;
  const response = await customAxios.get(requestUrl);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(`getUserPosts 에러, status : ${response.status}, text : ${response.statusText}`);
}

export async function followUser(followerId) {
  return await customAxios.post(`${API_URL}/${followerId}`);
}

export async function unFollowUser(followerId) {
  return await customAxios.delete(`${API_URL}/${followerId}`);
}