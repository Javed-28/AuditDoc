import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const processDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/api/process", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
