import {getFetch, postFetch} from "../../../../utils/fetchService.js";

const API_URL = import.meta.env.VITE_COMMENT_API_URL;

export async function getComments(id) {
  try {
    const response = await getFetch(`${API_URL}/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error during saveComment:", error);
  }
}

export async function saveComment(createReq) {
  try {
    return await postFetch(`${API_URL}`, createReq);
  } catch (error) {
    console.error("Error during saveComment:", error);
  }
}
