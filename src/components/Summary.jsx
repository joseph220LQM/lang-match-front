// src/components/Summary.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getUserStats } from "../services/api";

export default function Summary() {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getUserStats(user?.id);
        setStats(res);
      } catch (err) {
        console.error(err);
        alert("Error obteniendo estadísticas");
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) load();
  }, [user]);

  if (loading) return <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">Cargando...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Resumen de práctica</h3>

      {!stats && <div>No hay datos.</div>}

      {stats && (
        <div className="space-y-3">
          <div><strong>Total mensajes (usuario):</strong> {stats.totalMensajesUsuario}</div>
          <div><strong>Total mensajes (bot):</strong> {stats.totalMensajesBot}</div>
          <div><strong>Total sesiones:</strong> {stats.totalSesiones}</div>
          <div><strong>Duración total (min):</strong> {stats.duracionTotalMin}</div>
          <div><strong>Promedio duración (min):</strong> {stats.promedioDuracionMin}</div>

          <div className="mt-4">
            <h4 className="font-medium">Idiomas</h4>
            <ul className="list-disc pl-5">
              {stats.idiomas?.map((i, idx) => (
                <li key={idx}>{i.idioma}: {i.sesiones} sesiones</li>
              ))}
            </ul>
          </div>

          <div className="mt-3">
            <h4 className="font-medium">Niveles</h4>
            <ul className="list-disc pl-5">
              {stats.niveles?.map((n, idx) => (
                <li key={idx}>{n.nivel}: {n.sesiones} sesiones</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
