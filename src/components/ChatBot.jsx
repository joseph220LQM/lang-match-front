// src/components/ChatBot.jsx
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useUser } from "@clerk/clerk-react";
import {
  sendMessage,
  finalizeSession,
  downloadSessionPdf,
} from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ChatBot() {
  const { sessionId, messages, addMessage, language, level, clearSession } = useChat();
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  if (!sessionId) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
        <p>
          No hay sesión activa. Ve a{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => navigate("/select")}
          >
            selección de idioma
          </button>.
        </p>
      </div>
    );
  }

  async function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: "user", text, timestamp: new Date().toISOString() };
    addMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage({ sessionId, userId: user?.id, message: text });
      addMessage({
        role: "bot",
        text: res.respuesta || "...",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      addMessage({
        role: "bot",
        text: "Error: no se pudo obtener respuesta del bot.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleEndSession() {
    setShowModal(false);
    setLoading(true);
    try {
      await finalizeSession({ sessionId });
      alert("✅ Sesión finalizada correctamente. El PDF se descargará automáticamente.");
      clearSession();
      navigate("/summary");
    } catch (err) {
      console.error(err);
      alert("Error finalizando la sesión. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-4 flex flex-col" style={{ height: "75vh" }}>
      <div className="mb-3">
        <div className="text-sm text-gray-600">
          Language: <span className="font-medium">{language}</span> · Level:{" "}
          <span className="font-medium">{level}</span>
        </div>
      </div>

      {/* Chat messages */}
      <div ref={listRef} className="flex-1 overflow-auto space-y-3 p-3 border rounded">
        {messages.length === 0 && <div className="text-gray-500">Aún no hay mensajes.</div>}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block p-3 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Input and buttons */}
      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border rounded px-3 py-2"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "..." : "Enviar"}
        </button>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Finalizar
        </button>
      </form>

      {/* Botón separado para descargar PDF */}
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={() => downloadSessionPdf(sessionId)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Descargar PDF
        </button>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">¿Finalizar sesión?</h2>
            <p className="text-gray-600 mb-6">
              Se generará un PDF con toda tu conversación. ¿Deseas continuar?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleEndSession}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

