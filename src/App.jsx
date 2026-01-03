import { useState, useEffect } from "react";
import "./App.css";
import WeeklyView from "./components/WeeklyView";
import DailyView from "./components/DailyView";
import { mockClients } from "./data/mock";

const STORAGE_KEY = "agenda_estudio_m_clients";

function App() {
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : mockClients;
  });

  const [activeView, setActiveView] = useState("weekly");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const addClient = (client) =>
    setClients((prev) => [...prev, client]);

  const updateClient = (client) =>
    setClients((prev) =>
      prev.map((c) => (c.id === client.id ? client : c))
    );

  const deleteClient = (id) =>
    setClients((prev) => prev.filter((c) => c.id !== id));

  return (
    <div>
      <header style={{ background: "#111827", color: "white", padding: 16 }}>
        <h1>Agenda de Entrenamientos</h1>
      </header>

      <div style={{ padding: 12, display: "flex", gap: 8 }}>
        <button onClick={() => setActiveView("weekly")}>
          Vista Semanal
        </button>
        <button onClick={() => setActiveView("daily")}>
          Vista Diaria
        </button>
      </div>

      <main style={{ padding: 12 }}>
        {activeView === "weekly" && (
          <WeeklyView
            clients={clients}
            onAddClient={addClient}
            onUpdateClient={updateClient}
            onDeleteClient={deleteClient}
          />
        )}

        {activeView === "daily" && (
          <DailyView
            clients={clients}
            onAddClient={addClient}
            onUpdateClient={updateClient}
            onDeleteClient={deleteClient}
          />
        )}
      </main>
    </div>
  );
}

export default App;
