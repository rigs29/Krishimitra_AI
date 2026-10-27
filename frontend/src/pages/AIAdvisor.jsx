import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BotMessageSquare,
  Send,
  User,
  Sparkles,
  Trash2,
  ThumbsUp,
  Star,
  CornerDownLeft,
  Sprout,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Info,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { sendChatMessage, getChatInfo, submitChatFeedback } from "../api/chatAPI";
import "./AIAdvisor.css";

function AIAdvisor() {
  const { user, login } = useContext(AuthContext);
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Chat conversation state
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "🙏 **Namaste!** I am your KrishiMitra AI agronomist assistant. How can I help you optimize your crop yield, soil fertility, or market strategy today?",
      timestamp: new Date().toISOString(),
      confidence: 1.0,
      category: "general",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [chatInfo, setChatInfo] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Starter prompts supported by backend knowledge base
  const defaultSuggestions = [
    "How to treat early blight in tomato?",
    "When to apply Urea vs DAP fertilizer?",
    "Organic aphid pest control remedies",
    "Current market rates for wheat and rice",
    "How to maintain 5cm water for paddy crop?",
  ];

  const [currentSuggestions, setCurrentSuggestions] = useState(defaultSuggestions);

  // Initialize session and prefilled prompts (e.g. from disease detection link)
  useEffect(() => {
    let activeSession = localStorage.getItem("km_chat_session_id");
    if (!activeSession) {
      activeSession = Math.random().toString(36).substring(2, 10);
      localStorage.setItem("km_chat_session_id", activeSession);
    }
    setSessionId(activeSession);

    // Fetch API metadata
    getChatInfo()
      .then((data) => setChatInfo(data))
      .catch((err) => console.log("Chat info fetch silently handled:", err));

    // Check if navigated with state prompt
    if (location.state?.initialPrompt) {
      setTimeout(() => {
        handleSendMessage(location.state.initialPrompt);
      }, 300);
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Quick Demo Login for instant access
  const handleDemoLogin = () => {
    login({
      name: "Ramesh Patel",
      email: "ramesh.patel@farm.in",
      role: "Lead Farmer",
    });
    toast.success("Logged in as Ramesh Patel (Demo Farmer)!");
  };

  // Send message
  const handleSendMessage = async (textToSend = inputMessage) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg = {
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const historyContext = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage({
        message: trimmed,
        session_id: sessionId,
        history: historyContext,
        language: "english",
        farmer_id: user?.email || "anonymous_farmer",
      });

      const assistantMsg = {
        role: "assistant",
        content: res.response,
        timestamp: res.timestamp || new Date().toISOString(),
        confidence: res.confidence,
        category: res.category,
        followUp: res.follow_up_questions || [],
        actionItems: res.action_items || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (res.follow_up_questions && res.follow_up_questions.length > 0) {
        setCurrentSuggestions(res.follow_up_questions);
      } else if (res.suggestions && res.suggestions.length > 0) {
        setCurrentSuggestions(res.suggestions);
      }
    } catch (err) {
      console.error("Chat error:", err);
      toast.error(err.message || "Failed to reach AI assistant");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ I experienced a temporary connection delay. Please ensure the backend server is running and try again.",
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear current conversation history?")) {
      setMessages([
        {
          role: "assistant",
          content:
            "🙏 Conversation cleared. Ask me any new agronomy or market question!",
          timestamp: new Date().toISOString(),
          confidence: 1.0,
          category: "general",
        },
      ]);
      setCurrentSuggestions(defaultSuggestions);
      setFeedbackSubmitted(false);
      setFeedbackRating(0);
      toast.success("Conversation cleared");
    }
  };

  const handleRating = async (stars) => {
    setFeedbackRating(stars);
    try {
      await submitChatFeedback(sessionId, stars, "User rating");
      setFeedbackSubmitted(true);
      toast.success("Thank you for your rating!");
    } catch (err) {
      console.warn("Feedback err:", err);
    }
  };

  // Render markdown-like bold text
  const formatContent = (text) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="km-advisor-page km-animate-fade-in">
      {/* Top Banner */}
      <div className="km-advisor-top-bar">
        <div className="km-advisor-brand">
          <div className="km-advisor-avatar-box">
            <BotMessageSquare size={24} />
          </div>
          <div>
            <div className="km-advisor-title-row">
              <h2>KrishiMitra Agronomist Copilot</h2>
              <span className="km-badge km-badge-success">Online &bull; 24/7</span>
            </div>
            <p className="km-advisor-meta">
              Autonomous agronomy engine &bull; Pest control, fertilizers, sowing calendar & market rates
            </p>
          </div>
        </div>

        <div className="km-advisor-top-actions">
          <button
            type="button"
            onClick={clearChat}
            className="km-btn km-btn-outline km-btn-sm"
            title="Clear Chat History"
          >
            <Trash2 size={15} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="km-chat-shell">
        {/* Messages Stream */}
        <div className="km-messages-scroll-stream">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`km-message-row ${isUser ? "user-row" : "assistant-row"}`}
              >
                <div className={`km-msg-avatar ${isUser ? "user" : "assistant"}`}>
                  {isUser ? <User size={16} /> : <Sprout size={16} />}
                </div>

                <div className="km-msg-bubble-wrapper">
                  <div className={`km-msg-bubble ${isUser ? "user" : "assistant"}`}>
                    <div className="km-msg-text">{formatContent(msg.content)}</div>

                    {/* Action Items if provided */}
                    {msg.actionItems && msg.actionItems.length > 0 && (
                      <div className="km-msg-action-items">
                        <strong>Action Steps:</strong>
                        <ul>
                          {msg.actionItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="km-msg-footer">
                      <span className="km-msg-time mono-number">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {!isUser && msg.confidence !== undefined && (
                        <span className="km-msg-conf mono-number">
                          {Math.round(msg.confidence * 100)}% match
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Follow-up Question Chips under assistant bubble */}
                  {!isUser && msg.followUp && msg.followUp.length > 0 && (
                    <div className="km-bubble-followups">
                      <span className="km-followup-label">
                        <Lightbulb size={12} /> Suggested follow-up:
                      </span>
                      <div className="km-followup-chips">
                        {msg.followUp.map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="km-followup-chip"
                            onClick={() => handleSendMessage(q)}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="km-message-row assistant-row">
              <div className="km-msg-avatar assistant">
                <Sprout size={16} />
              </div>
              <div className="km-typing-bubble">
                <span className="km-typing-dot" />
                <span className="km-typing-dot" />
                <span className="km-typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips Bar */}
        {currentSuggestions.length > 0 && !loading && (
          <div className="km-suggestions-dock">
            <span className="km-sugg-title">
              <Sparkles size={13} className="text-emerald" /> Try asking:
            </span>
            <div className="km-sugg-chips-row">
              {currentSuggestions.map((sugg, i) => (
                <button
                  key={i}
                  type="button"
                  className="km-sugg-chip"
                  onClick={() => handleSendMessage(sugg)}
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="km-chat-input-bar">
          <textarea
            ref={inputRef}
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about crop diseases, pest remedies, urea/DAP dosage, or mandi rates... (Enter to send)"
            className="km-chat-textarea"
            disabled={loading}
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="km-chat-send-btn"
            title="Send message (Enter)"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>

        {/* Footer Rating & Disclaimer */}
        <div className="km-chat-footer-bar">
          <div className="km-rating-group">
            <span>Rate this assistant:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`km-star-btn ${star <= feedbackRating ? "filled" : ""}`}
                onClick={() => handleRating(star)}
                disabled={feedbackSubmitted}
                title={`Rate ${star} stars`}
              >
                <Star size={14} />
              </button>
            ))}
            {feedbackSubmitted && <span className="km-feedback-thanks">Thank you!</span>}
          </div>

          <span className="km-chat-disclaimer">
            &bull; AI agronomic advisory. For critical field interventions, verify with local KVK.
          </span>
        </div>
      </div>
    </div>
  );
}

export default AIAdvisor;
