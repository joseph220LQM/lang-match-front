// src/components/SelectLanguage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { createSession } from "../services/api";
import { useChat } from "../context/ChatContext";

export default function SelectLanguage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { setSessionId, setLanguage, setLevel, setStartedAt, addMessage } = useChat();

  const [language, setLangLocal] = useState("Inglés");
  const [level, setLevelLocal] = useState("Beginner");
  const [loading, setLoading] = useState(false);

  async function handleStart(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const nombre = user?.firstName || user?.fullName || "Student";
      const res = await createSession({
        userId: user?.id,
        language,
        level,
        nombre,
      });
      // expected: { status, fecha, sessionId, respuesta }
      setSessionId(res.sessionId);
      setLanguage(language);
      setLevel(level);
      setStartedAt(new Date());
      // push initial bot message
      addMessage({ role: "bot", text: res.respuesta || "Hello!", timestamp: new Date().toISOString() });
      navigate("/chat");
    } catch (err) {
      console.error(err);
      alert("Error creando la sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Start practice session</h2>
      <form onSubmit={handleStart} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Languages</label>
          <select value={language} onChange={(e) => setLangLocal(e.target.value)} className="mt-1 block w-full border rounded p-2">
            <option>Inglés</option>
            <option>Español</option>
            <option>Francés</option>
            <option>Alemán</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Levels</label>
          <select value={level} onChange={(e) => setLevelLocal(e.target.value)} className="mt-1 block w-full border rounded p-2">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? "Starting..." : "Start Session"}
          </button>
        </div>
      </form>
    </div>
  );
}
