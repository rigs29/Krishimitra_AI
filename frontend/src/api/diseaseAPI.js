import axiosClient from "./axiosClient";

/**
 * Upload single plant leaf image for AI disease detection
 * @param {File} imageFile - The file to upload
 * @param {string} cropType - Optional crop name (e.g., "Tomato", "Potato", "Wheat")
 */
export const detectDisease = async (imageFile, cropType = "unknown") => {
  const formData = new FormData();
  formData.append("file", imageFile);
  if (cropType && cropType !== "unknown") {
    formData.append("crop_type", cropType);
  }

  const response = await axiosClient.post("/disease/detect", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Upload multiple plant leaf images for batch disease detection
 * @param {File[]} imageFiles - Array of up to 5 files
 */
export const detectBatchDiseases = async (imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosClient.post("/disease/detect/batch", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Fetch supported crops and disease detection API metadata
 */
export const getDiseaseInfo = async () => {
  const response = await axiosClient.get("/disease/");
  return response.data;
};

/**
 * Fetch common diseases for a specific crop
 * @param {string} cropName
 */
export const getCropDiseases = async (cropName) => {
  const response = await axiosClient.get(`/disease/crop/${encodeURIComponent(cropName)}`);
  return response.data;
};

/**
 * Fetch in-depth details, treatment, and symptoms for a disease
 * @param {string} diseaseName
 */
export const getDiseaseDetails = async (diseaseName) => {
  const response = await axiosClient.get(`/disease/disease/${encodeURIComponent(diseaseName)}`);
  return response.data;
};
