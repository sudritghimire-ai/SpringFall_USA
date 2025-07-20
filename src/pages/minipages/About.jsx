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
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
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
        color: #1a202c;
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
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 60%),
          radial-gradient(circle at 60% 70%, rgba(156, 100, 234, 0.1) 0%, transparent 50%);
        pointer-events: none;
        z-index: -1;
        animation: backgroundPulse 20s ease-in-out infinite;
      }
      
      @keyframes backgroundPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      .chat-container {
        width: 100%;
        height: 100vh;
        margin: 0;
        border: none;
        border-radius: 0;
        display: flex;
        flex-direction: column;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(25px);
        box-shadow: none;
        overflow: hidden;
        animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(40px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .chat-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: linear-gradient(90deg, #667eea, #f093fb, #764ba2, #667eea);
        background-size: 400% 100%;
        animation: gradientShift 8s ease infinite;
      }
      
      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      .chat-header {
        padding: 35px 45px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
        color: #1a202c;
        font-size: 2.4rem;
        font-weight: 800;
        text-align: center;
        user-select: none;
        border-bottom: 1px solid rgba(0,0,0,0.03);
        letter-spacing: -0.025em;
        position: relative;
        overflow: hidden;
        min-height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }
      
      .chat-header::before {
        content: '🎓';
        position: absolute;
        left: 45px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 2.2rem;
        animation: bounce 3s ease-in-out infinite;
        filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.2));
      }
      
      .chat-header::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.03) 0%, transparent 70%);
        animation: headerGlow 6s ease-in-out infinite alternate;
        z-index: -1;
      }
      
      @keyframes headerGlow {
        0% { transform: rotate(0deg) scale(1); opacity: 0.5; }
        100% { transform: rotate(10deg) scale(1.1); opacity: 0.8; }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(-50%) scale(1);
        }
        10% {
          transform: translateY(-55%) scale(1.05);
        }
        40% {
          transform: translateY(-65%) scale(1.1);
        }
        60% {
          transform: translateY(-60%) scale(1.05);
        }
      }
      
      .chat-messages {
        flex: 1;
        padding: 45px 65px;
        overflow-y: auto;
        background: transparent;
        display: flex;
        flex-direction: column;
        gap: 24px;
        scroll-behavior: smooth;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
        position: relative;
      }
      
      .chat-messages::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 30px;
        background: linear-gradient(to bottom, transparent, rgba(102, 126, 234, 0.2), transparent);
        border-radius: 1px;
      }
      
      .chat-message {
        max-width: 70%;
        padding: 22px 28px;
        border-radius: 28px;
        word-wrap: break-word;
        white-space: pre-wrap;
        font-size: 1.05rem;
        line-height: 1.65;
        position: relative;
        animation: messageSlide 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform-origin: left center;
        font-weight: 400;
        transition: all 0.3s ease;
      }
      
      @keyframes messageSlide {
        from {
          opacity: 0;
          transform: translateX(-30px) scale(0.9) rotateX(10deg);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1) rotateX(0deg);
        }
      }
      
      .chat-message:hover {
        transform: translateY(-2px);
        transition: all 0.2s ease;
      }
      
      .chat-message.user {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 8px;
        box-shadow: 
          0 8px 32px rgba(102, 126, 234, 0.25),
          0 2px 8px rgba(102, 126, 234, 0.15);
        transform-origin: right center;
        position: relative;
        overflow: hidden;
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
        filter: drop-shadow(2px 2px 4px rgba(102, 126, 234, 0.2));
      }
      
      .chat-message.user::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        animation: userMessageShimmer 2s ease-in-out infinite;
      }
      
      @keyframes userMessageShimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      .chat-message.bot {
        background: rgba(255, 255, 255, 0.95);
        color: #2d3748;
        align-self: flex-start;
        border-bottom-left-radius: 8px;
        box-shadow: 
          0 8px 32px rgba(0,0,0,0.06),
          0 2px 8px rgba(0,0,0,0.04);
        border: 1px solid rgba(102, 126, 234, 0.08);
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
      }
      
      .chat-message.bot::before {
        content: '';
        position: absolute;
        left: -9px;
        bottom: 0;
        width: 0;
        height: 0;
        border-right: 9px solid rgba(255, 255, 255, 0.95);
        border-top: 9px solid transparent;
        filter: drop-shadow(-2px 2px 4px rgba(0,0,0,0.05));
      }
      
      .chat-message.bot::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
      }
      
      .chat-input-area {
        display: flex;
        padding: 35px 65px;
        background: rgba(255, 255, 255, 0.98);
        border-top: 1px solid rgba(102, 126, 234, 0.08);
        gap: 24px;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
        position: relative;
      }
      
      .chat-input-area::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(102, 126, 234, 0.3), transparent);
      }
      
      .chat-input {
        flex: 1;
        padding: 22px 32px;
        font-size: 1.1rem;
        border: 2px solid rgba(102, 126, 234, 0.15);
        border-radius: 35px;
        outline: none;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        background: rgba(255, 255, 255, 0.95);
        color: #1a202c;
        font-family: inherit;
        backdrop-filter: blur(15px);
        font-weight: 400;
        position: relative;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.08);
      }
      
      .chat-input::placeholder {
        color: #a0aec0;
        font-weight: 400;
        transition: all 0.3s ease;
      }
      
      .chat-input:focus {
        border-color: #667eea;
        box-shadow: 
          0 0 0 6px rgba(102, 126, 234, 0.08),
          0 8px 32px rgba(102, 126, 234, 0.15);
        transform: translateY(-3px) scale(1.01);
        background: white;
      }
      
      .chat-input:focus::placeholder {
        color: #cbd5e0;
        transform: translateX(4px);
      }
      
      .send-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 22px 36px;
        font-size: 1.1rem;
        border-radius: 35px;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        font-weight: 600;
        font-family: inherit;
        position: relative;
        overflow: hidden;
        min-width: 150px;
        box-shadow: 
          0 8px 32px rgba(102, 126, 234, 0.25),
          0 2px 8px rgba(102, 126, 234, 0.15);
      }
      
      .send-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        transition: left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .send-button:hover::before {
        left: 100%;
      }
      
      .send-button:disabled {
        background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
        color: #a0aec0;
        cursor: not-allowed;
        transform: none;
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      }
      
      .send-button:hover:not(:disabled) {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 
          0 12px 40px rgba(102, 126, 234, 0.3),
          0 4px 16px rgba(102, 126, 234, 0.2);
      }
      
      .send-button:active:not(:disabled) {
        transform: translateY(-2px) scale(1.01);
        box-shadow: 
          0 8px 32px rgba(102, 126, 234, 0.25),
          0 2px 8px rgba(102, 126, 234, 0.15);
      }
      
      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #718096;
        font-style: italic;
        font-weight: 500;
        animation: fadeIn 0.5s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .typing-dots {
        display: flex;
        gap: 6px;
      }
      
      .typing-dots span {
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 50%;
        animation: typingDots 1.6s ease-in-out infinite both;
        box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
      }
      
      .typing-dots span:nth-child(1) { animation-delay: -0.4s; }
      .typing-dots span:nth-child(2) { animation-delay: -0.2s; }
      .typing-dots span:nth-child(3) { animation-delay: 0s; }
      
      @keyframes typingDots {
        0%, 80%, 100% {
          transform: scale(0.6) translateY(0);
          opacity: 0.4;
        }
        40% {
          transform: scale(1.1) translateY(-8px);
          opacity: 1;
        }
      }

      
      /* Welcome message styles */
      .welcome-message {
        text-align: center;
        margin: 80px auto;
        max-width: 650px;
        opacity: 0.85;
        animation: welcomeAppear 1s ease 0.5s both;
      }
      
      @keyframes welcomeAppear {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 0.85;
          transform: translateY(0);
        }
      }
      
      .welcome-title {
        font-size: 2rem;
        font-weight: 700;
        color: #2d3748;
        margin-bottom: 18px;
        letter-spacing: -0.02em;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .welcome-subtitle {
        font-size: 1.15rem;
        color: #4a5568;
        line-height: 1.7;
        font-weight: 400;
      }

      /* Empty state illustration */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 350px;
      }
      
      .empty-icon {
        font-size: 5rem;
        margin-bottom: 25px;
        opacity: 0.7;
        animation: float 4s ease-in-out infinite;
        filter: drop-shadow(0 8px 16px rgba(102, 126, 234, 0.2));
      }
      
      @keyframes float {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg); 
        }
        50% { 
          transform: translateY(-15px) rotate(2deg); 
        }
      }

      /* Scrollbar styling */
      .chat-messages::-webkit-scrollbar {
        width: 10px;
      }
      .chat-messages::-webkit-scrollbar-track {
        background: rgba(102, 126, 234, 0.05);
        border-radius: 15px;
        margin: 10px 0;
      }
      .chat-messages::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        border: 2px solid transparent;
        background-clip: content-box;
        transition: all 0.3s ease;
      }
      .chat-messages::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        background-clip: content-box;
        box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .chat-header {
          font-size: 2rem;
          padding: 30px 35px;
        }
        .chat-header::before {
          left: 35px;
          font-size: 1.8rem;
        }
        .chat-messages {
          padding: 35px 30px;
          gap: 18px;
        }
        .chat-message {
          max-width: 85%;
          padding: 18px 22px;
          font-size: 1rem;
        }
        .chat-input-area {
          padding: 30px 30px;
          gap: 18px;
        }
        .chat-input, .send-button {
          padding: 18px 24px;
          font-size: 1.05rem;
        }
        .send-button {
          min-width: 120px;
        }
        .welcome-title {
          font-size: 1.7rem;
        }
        .welcome-subtitle {
          font-size: 1.05rem;
        }
        .empty-icon {
          font-size: 4rem;
        }
      }

      @media (max-width: 480px) {
        .chat-header {
          font-size: 1.7rem;
          padding: 25px 25px;
        }
        .chat-header::before {
          left: 25px;
          font-size: 1.5rem;
        }
        .chat-messages {
          padding: 25px 25px;
          gap: 15px;
        }
        .chat-message {
          max-width: 88%;
          padding: 15px 18px;
          font-size: 0.95rem;
        }
        .chat-input-area {
          flex-direction: column;
          padding: 25px 25px;
          gap: 18px;
        }
        .chat-input {
          width: 100%;
          padding: 18px 22px;
        }
        .send-button {
          width: 100%;
          padding: 18px 22px;
          min-width: auto;
        }
        .welcome-title {
          font-size: 1.5rem;
        }
        .welcome-subtitle {
          font-size: 1rem;
        }
        .empty-icon {
          font-size: 3.5rem;
        }
      }
    `}</style>
      <div className="chat-container" role="main" aria-label="University Search Engine Chatbot">
        <header className="chat-header">University Search Engine</header>
        <section className="chat-messages" id="chatMessages" aria-live="polite" aria-atomic="false">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <div className="welcome-message">
                <h2 className="welcome-title">Welcome to University Search Engine</h2>
                <p className="welcome-subtitle">
                  Ask me anything about universities, courses, admissions, rankings, or campus life. 
                  I'm here to help you find the perfect educational path!
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.role}`}>
                {message.content}
              </div>
            ))
          )}
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
        
      </div>
    </>
  )
}
