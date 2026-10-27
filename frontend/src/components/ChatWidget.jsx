import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  BotMessageSquare,
  X,
  Send,
  Trash2,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../api/chatAPI";
import "./ChatWidget.css";

function ChatWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! 🙏 I am KrishiMitra AI. Need quick advice on crop care, fertilizers, or mandi rates?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let sid = localStorage.getItem("km_chat_session_id");
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 10);
      localStorage.setItem("km_chat_session_id", sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg = {
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const historyContext = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage({
        message: trimmed,
        session_id: sessionId,
        history: historyContext,
      });

      const botMsg = {
        role: "assistant",
        content: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Widget error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble connecting. Please check if the backend is running.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Namaste! 🙏 How can I assist your farming today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="km-widget-root">
      {/* Trigger Button */}
      <button
        type="button"
        className={`km-widget-fab ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with AI Agronomist"
        aria-label="Toggle AI Chat Widget"
      >
        {isOpen ? <X size={22} /> : <BotMessageSquare size={24} />}
        {!isOpen && <span className="km-widget-fab-badge" />}
      </button>

      {/* Popover Window */}
      {isOpen && (
        <div className="km-widget-window km-animate-fade-in">
          {/* Header */}
          <div className="km-widget-head">
            <div className="km-widget-head-info">
              <div className="km-widget-avatar">
                <BotMessageSquare size={18} />
              </div>
              <div>
                <h4>KrishiMitra Copilot</h4>
                <span className="km-widget-online-dot">Online</span>
              </div>
            </div>

            <div className="km-widget-head-actions">
              <button
                type="button"
                className="km-widget-action-btn"
                title="Open full page assistant"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/advisor");
                }}
              >
                <Maximize2 size={15} />
              </button>
              <button
                type="button"
                className="km-widget-action-btn"
                title="Clear messages"
                onClick={clearChat}
              >
                <Trash2 size={15} />
              </button>
              <button
                type="button"
                className="km-widget-action-btn"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="km-widget-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`km-widget-msg ${m.role === "user" ? "user" : "assistant"}`}
              >
                <div className="km-widget-msg-text">{m.content}</div>
                <span className="km-widget-msg-time">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="km-widget-msg assistant km-typing-msg">
                <span className="km-wtyping-dot" />
                <span className="km-wtyping-dot" />
                <span className="km-wtyping-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="km-widget-quick-chips">
            <button
              type="button"
              className="km-wchip"
              onClick={() => handleSend("Tomato leaf disease control")}
            >
              Tomato Blight
            </button>
            <button
              type="button"
              className="km-wchip"
              onClick={() => handleSend("Current wheat mandi price")}
            >
              Wheat Price
            </button>
          </div>

          {/* Input Area */}
          <div className="km-widget-input-row">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask a quick farming question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              className="km-widget-input"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="km-widget-send-btn"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;
