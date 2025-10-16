// src/components/Layout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

export default function Layout() {
  const { user } = useUser();
  const clerk = useClerk();

  const name = user?.fullName || user?.firstName || "User";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/select" className="text-xl font-semibold">LangMatch</Link>
          <nav className="flex items-center gap-4">
            <Link to="/select" className="text-sm">Practice</Link>
            <Link to="/chat" className="text-sm">Chat</Link>
            <Link to="/summary" className="text-sm">Summary</Link>
            <div className="ml-4 text-sm">Hi, <span className="font-medium">{name}</span></div>
            <button
              onClick={() => clerk.signOut()}
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
