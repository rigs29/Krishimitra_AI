import axiosClient from "./axiosClient";

/**
 * Fetch current weather conditions for a location
 * @param {string} location
 */
export const getCurrentWeather = async (location = "Sample Farm, India") => {
  const response = await axiosClient.get("/weather/", {
    params: { location },
  });
  return response.data;
};

/**
 * Fetch multi-day weather forecast
 * @param {number} days - Between 1 and 7
 * @param {string} location
 */
export const getWeatherForecast = async (days = 5, location = "Sample Farm, India") => {
  const response = await axiosClient.get("/weather/forecast", {
    params: { days, location },
  });
  return response.data;
};

/**
 * Fetch weather for a specific city
 * @param {string} city
 */
export const getWeatherByCity = async (city) => {
  const response = await axiosClient.get(`/weather/location/${encodeURIComponent(city)}`);
  return response.data;
};

/**
 * Fetch daily agricultural advisory based on live weather
 */
export const getDailyAdvisory = async () => {
  const response = await axiosClient.get("/weather/advisory/daily");
  return response.data;
};
