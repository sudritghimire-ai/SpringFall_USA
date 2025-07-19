'use client';
import React from 'react';
"use client"

import { useState, useRef, useEffect } from "react"

export default function ChatBot() {
  const [messages, setMessages] = useState([]) // Stores chat history for UI
  const [currentInput, setCurrentInput] = useState("") // For the input field
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null) // Ref for auto-scrollinga

  // Auto-scroll to bottom on new messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function sendMessage() {
    if (!currentInput.trim()) {
      // Add a temporary message for empty input
      setMessages((prev) => [...prev, { id: Date.now(), role: "bot", content: "Please enter a message." }])
      return
    }

    const userMessage = { id: Date.now(), role: "user", content: currentInput }
    setMessages((prev) => [...prev, userMessage]) // Add user message to history
    setCurrentInput("") // Clear input immediately
    setLoading(true)

    try {
const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
   
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "deepseek/deepseek-r1:free",
    messages: [{ role: "user", content: userMessage.content }],
  }),
})



      const data = await res.json()
      const botResponseContent = data.choices?.[0]?.message?.content || "No response received."
      const botMessage = { id: Date.now() + 1, role: "bot", content: botResponseContent }
      setMessages((prev) => [...prev, botMessage]) // Add bot message to history
    } catch (error) {
      const errorMessage = { id: Date.now() + 1, role: "bot", content: "Error: " + error.message }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2d3748;
        position: relative;
        overflow-x: hidden;
      }
      
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
        pointer-events: none;
        z-index: -1;
      }
      
      .chat-container {
        max-width: 900px;
        margin: 20px auto;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 120px);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        box-shadow: 
          0 20px 40px rgba(0,0,0,0.1),
          0 0 0 1px rgba(255, 255, 255, 0.3) inset;
        overflow: hidden;
        animation: slideUp 0.6s ease-out;
        position: relative;
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .chat-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
        border-radius: 20px 20px 0 0;
      }
      
      .chat-header {
        padding: 25px 30px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        color: #2d3748;
        font-size: 1.8rem;
        font-weight: 700;
        text-align: center;
        user-select: none;
        border-bottom: 1px solid rgba(0,0,0,0.05);
        letter-spacing: -0.02em;
        position: relative;
        overflow: hidden;
      }
      
      .chat-header::before {
        content: '🎓';
        position: absolute;
        left: 30px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.5rem;
        animation: bounce 2s infinite;
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(-50%);
        }
        40% {
          transform: translateY(-60%);
        }
        60% {
          transform: translateY(-55%);
        }
      }
      
      .chat-messages {
        flex: 1;
        padding: 25px 30px;
        overflow-y: auto;
        background: transparent;
        display: flex;
        flex-direction: column;
        gap: 16px;
        scroll-behavior: smooth;
      }
      
      .chat-message {
        max-width: 75%;
        padding: 16px 22px;
        border-radius: 20px;
        word-wrap: break-word;
        white-space: pre-wrap;
        font-size: 0.95rem;
        line-height: 1.6;
        position: relative;
        animation: messageSlide 0.4s ease-out;
        transform-origin: left center;
      }
      
      @keyframes messageSlide {
        from {
          opacity: 0;
          transform: translateX(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      
      .chat-message.user {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 8px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        transform-origin: right center;
      }
      
      .chat-message.user::before {
        content: '';
        position: absolute;
        right: -8px;
        bottom: 0;
        width: 0;
        height: 0;
        border-left: 8px solid #764ba2;
        border-top: 8px solid transparent;
      }
      
      .chat-message.bot {
        background: rgba(255, 255, 255, 0.9);
        color: #2d3748;
        align-self: flex-start;
        border-bottom-left-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        border: 1px solid rgba(0,0,0,0.05);
      }
      
      .chat-message.bot::before {
        content: '';
        position: absolute;
        left: -8px;
        bottom: 0;
        width: 0;
        height: 0;
        border-right: 8px solid rgba(255, 255, 255, 0.9);
        border-top: 8px solid transparent;
      }
      
      .chat-input-area {
        display: flex;
        padding: 20px 30px;
        background: rgba(255, 255, 255, 0.95);
        border-top: 1px solid rgba(0,0,0,0.05);
        gap: 15px;
        align-items: center;
      }
      
      .chat-input {
        flex: 1;
        padding: 16px 24px;
        font-size: 1rem;
        border: 2px solid rgba(102, 126, 234, 0.2);
        border-radius: 30px;
        outline: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(255, 255, 255, 0.9);
        color: #2d3748;
        font-family: inherit;
        backdrop-filter: blur(10px);
      }
      
      .chat-input::placeholder {
        color: #a0aec0;
        font-weight: 400;
      }
      
      .chat-input:focus {
        border-color: #667eea;
        box-shadow: 
          0 0 0 4px rgba(102, 126, 234, 0.1),
          0 4px 20px rgba(102, 126, 234, 0.15);
        transform: translateY(-1px);
        background: white;
      }
      
      .send-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 16px 28px;
        font-size: 1rem;
        border-radius: 30px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 600;
        font-family: inherit;
        position: relative;
        overflow: hidden;
        min-width: 120px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }
      
      .send-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.6s;
      }
      
      .send-button:hover::before {
        left: 100%;
      }
      
      .send-button:disabled {
        background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
        color: #a0aec0;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      
      .send-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
      }
      
      .send-button:active:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }
      
      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #a0aec0;
        font-style: italic;
      }
      
      .typing-dots {
        display: flex;
        gap: 4px;
      }
      
      .typing-dots span {
        width: 6px;
        height: 6px;
        background: #a0aec0;
        border-radius: 50%;
        animation: typingDots 1.4s ease-in-out infinite both;
      }
      
      .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
      .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
      .typing-dots span:nth-child(3) { animation-delay: 0s; }
      
      @keyframes typingDots {
        0%, 80%, 100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .chat-footer {
        padding: 15px 30px;
        text-align: center;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
        border-top: 1px solid rgba(0,0,0,0.05);
        color: #718096;
        font-size: 0.9rem;
        font-weight: 500;
        position: relative;
      }
      
      .footer-text {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        opacity: 0.8;
        transition: opacity 0.3s ease;
      }
      
      .footer-text:hover {
        opacity: 1;
      }
      
      .smile-emoji {
        font-size: 1.1em;
        animation: smile 3s ease-in-out infinite;
      }
      
      @keyframes smile {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      /* Scrollbar styling */
      .chat-messages::-webkit-scrollbar {
        width: 8px;
      }
      .chat-messages::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.05);
        border-radius: 10px;
      }
      .chat-messages::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      .chat-messages::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        background-clip: content-box;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .chat-container {
          margin: 10px;
          height: calc(100vh - 20px);
          max-width: calc(100% - 20px);
          border-radius: 15px;
        }
        .chat-header {
          font-size: 1.5rem;
          padding: 20px 25px;
        }
        .chat-messages {
          padding: 20px 25px;
          gap: 12px;
        }
        .chat-message {
          max-width: 85%;
          padding: 12px 18px;
          font-size: 0.9rem;
        }
        .chat-input-area {
          padding: 15px 25px;
          gap: 12px;
        }
        .chat-input, .send-button {
          padding: 14px 20px;
          font-size: 0.9rem;
        }
        .send-button {
          min-width: 100px;
        }
      }

      @media (max-width: 480px) {
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .chat-container {
          margin: 0;
          height: 100vh;
          border-radius: 0;
          box-shadow: none;
          border: none;
        }
        .chat-header {
          font-size: 1.3rem;
          padding: 18px 20px;
        }
        .chat-header::before {
          left: 20px;
          font-size: 1.3rem;
        }
        .chat-messages {
          padding: 15px 20px;
          gap: 10px;
        }
        .chat-message {
          max-width: 90%;
          padding: 10px 15px;
          font-size: 0.85rem;
        }
        .chat-input-area {
          flex-direction: column;
          padding: 15px 20px;
          gap: 12px;
        }
        .chat-input {
          width: 100%;
          padding: 14px 20px;
        }
        .send-button {
          width: 100%;
          padding: 14px 20px;
          min-width: auto;
        }
        .chat-footer {
          padding: 12px 20px;
          font-size: 0.8rem;
        }
      }
    `}</style>
      <div className="chat-container" role="main" aria-label="University Search Engine Chatbot">
        <header className="chat-header">University Search Engine</header>
        <section className="chat-messages" id="chatMessages" aria-live="polite" aria-atomic="false">
          {messages.map((message) => (
            <div key={message.id} className={`chat-message ${message.role}`}>
              {message.content}
            </div>
          ))}
          {loading && (
            <div className="chat-message bot">
              <div className="typing-indicator">
                <span>Typing</span>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Element to scroll into view */}
        </section>
        <div
          className="chat-input-area"
          role="form"
          aria-label="Send message form"
        >
          <input
            type="text"
            className="chat-input"
            placeholder="Ask about universities..."
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                sendMessage()
              }
            }}
            disabled={loading}
            aria-label="Message input"
          />
          <button 
            type="button" 
            className="send-button" 
            disabled={loading}
            onClick={sendMessage}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage()
              }
            }}
          >
            {loading ? "Sending..." : "Search"}
          </button>
        </div>
        <footer className="chat-footer">
          <div className="footer-text">
            Be a reason they rise with a <span className="smile-emoji">😊-</span>
          </div>
        </footer>
      </div>
    </>
  )
}
