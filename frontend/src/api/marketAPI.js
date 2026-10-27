import axiosClient from "./axiosClient";

/**
 * Fetch current market prices with optional filtering and sorting
 * @param {Object} options
 * @param {string} options.category - Crop category filter
 * @param {number} options.min_price - Minimum price filter
 * @param {number} options.max_price - Maximum price filter
 * @param {string} options.sort_by - Sort field ("price", "change", "crop")
 */
export const getMarketPrices = async (options = {}) => {
  const params = {};
  if (options.category && options.category !== "All") params.category = options.category;
  if (options.min_price) params.min_price = options.min_price;
  if (options.max_price) params.max_price = options.max_price;
  if (options.sort_by) params.sort_by = options.sort_by;

  const response = await axiosClient.get("/market/", { params });
  return response.data;
};

/**
 * Fetch detailed price information and mandi breakdowns for a specific crop
 * @param {string} cropName
 * @param {string} marketGrade - "National" | "Regional" | "Local"
 */
export const getCropPriceDetails = async (cropName, marketGrade = null) => {
  const params = marketGrade ? { market_grade: marketGrade } : {};
  const response = await axiosClient.get(`/market/${encodeURIComponent(cropName)}`, { params });
  return response.data;
};

/**
 * Fetch historical price trends and predictive outlook for a crop
 * @param {string} cropName
 * @param {number} days - Number of days (1-90)
 * @param {string} interval - "daily" | "weekly" | "monthly"
 */
export const getPriceTrends = async (cropName, days = 14, interval = "daily") => {
  const response = await axiosClient.get(`/market/trends/${encodeURIComponent(cropName)}`, {
    params: { days, interval },
  });
  return response.data;
};

/**
 * Compare market prices, profitability, and trends across multiple crops
 * @param {string[]} crops - Array of crop names
 * @param {number} days - Comparison period
 */
export const compareCrops = async (crops = ["Wheat", "Rice", "Tomato"], days = 30) => {
  const cropsParam = Array.isArray(crops) ? crops.join(",") : crops;
  const response = await axiosClient.get("/market/compare/", {
    params: { crops: cropsParam, days },
  });
  return response.data;
};
