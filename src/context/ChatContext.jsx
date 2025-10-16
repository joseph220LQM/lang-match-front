// src/context/ChatContext.jsx
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [language, setLanguage] = useState(null);
  const [level, setLevel] = useState(null);
  const [messages, setMessages] = useState([]); // { role: 'user'|'bot', text, timestamp }
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);

  function addMessage(msg) {
    setMessages((m) => [...m, msg]);
  }

  function clearSession() {
    setSessionId(null);
    setLanguage(null);
    setLevel(null);
    setMessages([]);
    setStartedAt(null);
    setEndedAt(null);
  }

  return (
    <ChatContext.Provider
      value={{
        sessionId,
        setSessionId,
        language,
        setLanguage,
        level,
        setLevel,
        messages,
        addMessage,
        startedAt,
        setStartedAt,
        endedAt,
        setEndedAt,
        clearSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
