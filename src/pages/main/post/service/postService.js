import defaultFetch from "../../../../common/defaultFetch.js";

const API_URL = import.meta.env.VITE_POST_API_URL;

export async function getPosts(cursor) {
  try {
    return defaultFetch(`${API_URL}?cursor=${cursor}`, "GET");
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function getPost(postId) {
  try {
    return defaultFetch(`${API_URL}/${postId}`, "GET");
  } catch (error) {
    console.error("Error during Request:", error);
  }
}

export async function savePost(createReq) {
  try {
    return defaultFetch(`${API_URL}`, "POST", createReq);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}
