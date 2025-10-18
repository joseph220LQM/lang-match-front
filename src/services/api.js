// src/services/api.js
const BASE = "http://3.220.24.160";

/**
 * Crea una nueva sala (sesión de práctica)
 */
export async function createSession({ userId, language, level, nombre }) {
  const res = await fetch(`${BASE}/sala/crearSala`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, language, level, nombre }),
  });
  if (!res.ok) throw new Error("Error creando sala");
  return res.json();
}

/**
 * Envía un mensaje al bot dentro de una sesión activa
 */
export async function sendMessage({ sessionId, userId, message }) {
  const res = await fetch(`${BASE}/sala/mensaje`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, userId, message }),
  });
  if (!res.ok) throw new Error("Error enviando mensaje");
  return res.json();
}

/**
 * Finaliza la sesión y descarga automáticamente el PDF si el backend lo envía.
 */
export async function finalizeSession({ sessionId }) {
  try {
    const res = await fetch(`${BASE}/sala/finalizarSession`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    const contentType = res.headers.get("content-type");

    // ✅ Si el backend devuelve PDF directamente
    if (contentType && contentType.includes("application/pdf")) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LangMatch_Sesion_${sessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return { status: "ok", message: "PDF descargado automáticamente" };
    }

    // ✅ Si devuelve JSON
    if (res.ok) {
      try {
        const data = await res.json();
        return data;
      } catch {
        return { status: "ok" };
      }
    }

    throw new Error("Error finalizando sesión");
  } catch (error) {
    console.error("❌ Error al finalizar sesión:", error);
    throw error;
  }
}

/**
 * Descargar PDF sin finalizar sesión
 */
export async function downloadSessionPdf(sessionId) {
  try {
    const res = await fetch(`${BASE}/sala/session/${sessionId}/export-pdf`);
    if (!res.ok) throw new Error("Error exportando PDF");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LangMatch_Sesion_${sessionId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Error descargando PDF:", error);
    alert("Error al descargar el PDF.");
  }
}

/**
 * Obtener estadísticas del usuario
 */
export async function getUserStats(userId) {
  const res = await fetch(`${BASE}/user/stats/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("Error obteniendo estadísticas");
  return res.json();
}

/**
 * Obtener estadísticas globales
 */
export async function getGlobalStats() {
  const res = await fetch(`${BASE}/sala/stats/global`);
  if (!res.ok) throw new Error("Error obteniendo estadísticas globales");
  return res.json();
}

