// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import SelectLanguage from "./components/SelectLanguage";
import ChatBot from "./components/ChatBot";
import Summary from "./components/Summary";
import RequireAuth from "./components/RequireAuth";
import { ChatProvider } from "./context/ChatContext";

export default function App() {
  const location = useLocation();

  return (
    <ChatProvider>
      <Routes>
        {/* Redirige al /select si está logueado, sino al login */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/select" replace />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          }
        />

        {/* Login y Registro sin redirección forzada */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas con autenticación */}
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/select" element={<SelectLanguage />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/summary" element={<Summary />} />
        </Route>

        {/* Cualquier ruta inválida redirige según estado */}
        <Route
          path="*"
          element={
            <>
              <SignedIn>
                <Navigate to="/select" replace />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ChatProvider>
  );
}

