import {getFetch} from "../../../../utils/fetchService.js";

const API_URL = '/group';

export async function getGroup(userId) {
  try {
    const response = await getFetch(`${API_URL}/${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Error during Request:", error);
  }
}
