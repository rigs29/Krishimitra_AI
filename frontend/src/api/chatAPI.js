import axiosClient from "./axiosClient";

/**
 * Send message to KrishiMitra AI Advisor
 * @param {Object} params
 * @param {string} params.message
 * @param {string} params.session_id
 * @param {Array} params.history
 * @param {string} params.language
 * @param {string} params.farmer_id
 */
export const sendChatMessage = async ({
  message,
  session_id,
  history = [],
  language = "english",
  farmer_id = null,
}) => {
  const response = await axiosClient.post("/chat/message", {
    message,
    session_id,
    history,
    language,
    farmer_id,
  });
  return response.data;
};

/**
 * Fetch AI Advisor capabilities and system metadata
 */
export const getChatInfo = async () => {
  const response = await axiosClient.get("/chat/");
  return response.data;
};

/**
 * Submit user feedback for a chat session
 * @param {string} sessionId
 * @param {number} rating - 1 to 5
 * @param {string} feedbackText
 */
export const submitChatFeedback = async (sessionId, rating, feedbackText = "") => {
  const response = await axiosClient.post("/chat/feedback", null, {
    params: {
      session_id: sessionId,
      rating,
      feedback_text: feedbackText,
    },
  });
  return response.data;
};

/**
 * Fetch analytics / topic summary for a session
 * @param {string} sessionId
 */
export const getSessionSummary = async (sessionId) => {
  const response = await axiosClient.get(`/chat/session/${encodeURIComponent(sessionId)}`);
  return response.data;
};
