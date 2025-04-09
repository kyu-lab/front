import customAxios from "../utils/customAxios.js";

const FILE_API_URL = "/file";

export async function uploadUserImg(imgFile, userId) {
  try {
    const formData = new FormData();
    formData.set("file", imgFile);
    const respnose = await customAxios.post(`${FILE_API_URL}/upload/user/image?userId=${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return respnose.data;
  } catch (error) {
    throw error;
  }
}

export async function uploadPostImg(imgFile) {
  try {
    const formData = new FormData();
    formData.set("file", imgFile);
    const respnose = await customAxios.post(`${FILE_API_URL}/upload/post/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return respnose.data;
  } catch (error) {
    throw error;
  }
}