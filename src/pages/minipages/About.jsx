'use client';
import React from 'react';
"use client"

import { useState, useRef, useEffect } from "react"

export default function ChatBot() {
  const [messages, setMessages] = useState([]) // Stores chat history for UI
  const [currentInput, setCurrentInput] = useState("") // For the input field
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null) // Ref for auto-scrolling

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
      body {
        margin: 0;
        padding: 0;
        background-color: #f7f7f8; /* Light background for the whole page, similar to ChatGPT */
        font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; /* Modern font stack */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #343541; /* Default text color */
      }
      .chat-container {
        max-width: 800px; /* Wider for a more spacious feel */
        margin: 20px auto; /* Less margin on top/bottom for full height feel */
        border: 1px solid #e5e5e5; /* Subtle border */
        border-radius: 12px; /* Rounded corners */
        display: flex;
        flex-direction: column;
        height: calc(100vh - 40px); /* Full height minus margin */
        background: #ffffff; /* White for the chat box */
        box-shadow: 0 4px 20px rgba(0,0,0,0.08); /* Softer, larger shadow */
        overflow: hidden;
      }
      .chat-header {
        padding: 20px 25px;
        background-color: #f0f0f0; /* Light grey for header */
        color: #343541; /* Dark text */
        font-size: 1.6rem; /* Slightly larger font */
        font-weight: 600; /* Medium bold */
        text-align: center;
        user-select: none;
        border-bottom: 1px solid #e5e5e5; /* Subtle separator */
        letter-spacing: 0.02em;
      }
      .chat-messages {
        flex: 1;
        padding: 20px 25px;
        overflow-y: auto;
        background: #ffffff; /* White background for messages area */
        display: flex;
        flex-direction: column;
        gap: 12px; /* Space between messages */
        scroll-behavior: smooth;
      }
      .chat-message {
        max-width: 75%; /* Slightly less wide */
        padding: 12px 18px; /* More padding */
        border-radius: 18px; /* Rounded, but not fully pill-shaped */
        word-wrap: break-word;
        white-space: pre-wrap;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* Very subtle shadow for bubbles */
        font-size: 0.95rem; /* Standard message font size */
        line-height: 1.5;
      }
      .chat-message.user {
        background-color: #e6f2ff; /* Light blue for user, similar to ChatGPT's subtle highlight */
        color: #343541;
        align-self: flex-end; /* Align to right */
        border-bottom-right-radius: 6px; /* Slightly less rounded on one corner */
      }
      .chat-message.bot {
        background-color: #f7f7f8; /* Very light grey for bot, almost white */
        color: #343541;
        align-self: flex-start; /* Align to left */
        border-bottom-left-radius: 6px; /* Slightly less rounded on one corner */
      }
      .chat-input-area {
        display: flex;
        padding: 15px 25px;
        background-color: #ffffff; /* White background for input area */
        border-top: 1px solid #e5e5e5; /* Subtle separator */
      }
      .chat-input {
        flex: 1;
        padding: 12px 20px; /* More padding */
        font-size: 1rem;
        border: 1px solid #d1d5db; /* Light grey border */
        border-radius: 24px; /* Rounded */
        outline: none;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
        background-color: #ffffff; /* White input background */
        color: #343541; /* Dark text */
      }
      .chat-input::placeholder {
        color: #9ca3af; /* Lighter placeholder text */
      }
      .chat-input:focus {
        border-color: #a7d9ff; /* Light blue border on focus */
        box-shadow: 0 0 0 3px rgba(167, 217, 255, 0.4); /* Light blue glow */
      }
      .send-button {
        margin-left: 15px;
        background-color: #10a37f; /* ChatGPT's green */
        color: white;
        border: none;
        padding: 12px 25px; /* More padding */
        font-size: 1rem;
        border-radius: 24px; /* Rounded */
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
        font-weight: 500;
      }
      .send-button:disabled {
        background-color: #d1d5db; /* Light grey when disabled */
        color: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      .send-button:hover:not(:disabled) {
        background-color: #0e8e6f; /* Darker green on hover */
        transform: translateY(-1px); /* Subtle lift effect */
        box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* Shadow on hover */
      }
      .send-button:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      }

      /* Scrollbar styling */
      .chat-messages::-webkit-scrollbar {
        width: 8px;
      }
      .chat-messages::-webkit-scrollbar-track {
        background: #f0f0f0;
        border-radius: 10px;
      }
      .chat-messages::-webkit-scrollbar-thumb {
        background-color: #c0c0c0;
        border-radius: 4px;
      }
      .chat-messages::-webkit-scrollbar-thumb:hover {
        background-color: #a0a0a0;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .chat-container {
          margin: 10px;
          height: calc(100vh - 20px);
          max-width: 98%;
          border-radius: 8px;
        }
        .chat-header {
          font-size: 1.4rem;
          padding: 15px 20px;
        }
        .chat-messages {
          padding: 15px 20px;
          gap: 10px;
        }
        .chat-message {
          max-width: 88%;
          padding: 10px 15px;
          font-size: 0.9rem;
        }
        .chat-input-area {
          padding: 10px 20px;
        }
        .chat-input, .send-button {
          padding: 10px 18px;
          font-size: 0.9rem;
        }
        .send-button {
          margin-left: 10px;
        }
      }

      @media (max-width: 480px) {
        .chat-container {
          margin: 0;
          height: 100vh;
          border-radius: 0;
          box-shadow: none;
        }
        .chat-header {
          font-size: 1.2rem;
          padding: 12px 15px;
        }
        .chat-messages {
          padding: 10px 15px;
          gap: 8px;
        }
        .chat-message {
          max-width: 100%; /* Allow full width on small screens */
          padding: 8px 12px;
          font-size: 0.85rem;
        }
        .chat-input-area {
          flex-direction: column;
          padding: 10px 15px;
        }
        .chat-input {
          margin-bottom: 10px;
          width: 100%;
          padding: 10px 15px;
        }
        .send-button {
          margin-left: 0;
          width: 100%;
          padding: 10px 15px;
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
            <div
              className="chat-message bot"
              style={{
                fontStyle: "italic",
                color: "#9ca3af",
                alignSelf: "flex-start",
                backgroundColor: "#f7f7f8",
                boxShadow: "none",
              }}
            >
              Typing...
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Element to scroll into view */}
        </section>
        <form
          className="chat-input-area"
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          role="form"
          aria-label="Send message form"
        >
          <input
            type="text"
            className="chat-input"
            placeholder="Ask about universities..."
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            disabled={loading}
            aria-label="Message input"
          />
          <button type="submit" className="send-button" disabled={loading}>
            {loading ? "Sending..." : "Search"}
          </button>
        </form>
      </div>
    </>
  )
}
