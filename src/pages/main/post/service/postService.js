import {getFetch, postFetch} from "../../../../utils/fetchService.js";

const API_URL = '/post';

export async function getPosts(cursor) {
  try {
    const response = await getFetch(`${API_URL}?cursor=${cursor}`);
    if (!response.ok) {

    }
    return await response.json();
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function getPost(postId) {
  try {
    const response = await getFetch(`${API_URL}/${postId}`);
    return await response.json();
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function savePost(createReq) {
  try {
    return await postFetch(`${API_URL}`, createReq);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}
