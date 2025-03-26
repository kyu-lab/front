import {getFetch} from "../../../../utils/fetchService.js";

const API_URL = import.meta.env.VITE_GROUP_API_URL;

export async function getGroup(userId) {
  try {
    const response = await getFetch(`${API_URL}/${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Error during Request:", error);
  }
}
