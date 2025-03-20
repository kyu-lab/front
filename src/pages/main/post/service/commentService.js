import defaultFetch from "../../../../common/defaultFetch.js";

const API_URL = import.meta.env.VITE_COMMENT_API_URL;

export async function saveComment(createReq) {
  try {
    return defaultFetch(`${API_URL}`, "POST", createReq);
  } catch (error) {
    console.error("Error during Request:", error);
  }
}
