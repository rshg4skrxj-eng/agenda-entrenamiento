import { useState, useEffect } from "react";
import "./App.css";
import WeeklyView from "./components/WeeklyView";
import DailyView from "./components/DailyView";
import ClientModal from "./components/ClientModal";
import { mockClients } from "./data/mock";

const STORAGE_KEY = "agenda_estudio_m_clients";

function App() {
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : mockClients;
  });

  const [activeView, setActiveView] = useState("weekly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

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
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">Agenda de Entrenamientos</h1>
      </header>

      <div className="app-toolbar">
        <button
          className={activeView === "weekly" ? "primary" : ""}
          onClick={() => setActiveView("weekly")}
        >
          Vista Semanal
        </button>

        <button
          className={activeView === "daily" ? "primary" : ""}
          onClick={() => setActiveView("daily")}
        >
          Vista Diaria
        </button>

        <button
          className="primary"
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
        >
          + Agregar cliente
        </button>
      </div>

      <main className="app-main">
        {activeView === "weekly" && (
          <WeeklyView
            clients={clients}
            onUpdateClient={updateClient}
            onDeleteClient={deleteClient}
            onEditClient={(c) => {
              setEditingClient(c);
              setIsModalOpen(true);
            }}
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

      <ClientModal
        isOpen={isModalOpen}
        client={editingClient}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onSave={(c) =>
          editingClient ? updateClient(c) : addClient(c)
        }
        onDelete={(id) => {
          deleteClient(id);
          setIsModalOpen(false);
          setEditingClient(null);
        }}
      />
    </div>
  );
}

export default App;
