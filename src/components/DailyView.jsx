import { useState } from "react";
import { DAYS, TIME_SLOTS, MAX_CLIENTS_PER_SLOT } from "../data/mock";
import ClientModal from "./ClientModal";

export default function DailyView({
  clients = [],
  onAddClient,
  onUpdateClient,
  onDeleteClient,
}) {
  const [selectedDay, setSelectedDay] = useState(DAYS[0].key);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clientName, setClientName] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [editingClient, setEditingClient] = useState(null);

  const getClientsInSlot = (day, time) =>
    clients.filter((c) =>
      c.schedules.some(
        (s) => s.day === day && s.start <= time && s.end > time
      )
    );

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const openNew = (time) => {
    setEditingClient(null);
    setClientName("");
    setSelectedDays([selectedDay]);
    setSelectedSlot({ day: selectedDay, time });
    setIsModalOpen(true);
  };

  const openEdit = (client) => {
    setEditingClient(client);
    setClientName(client.name);
    setSelectedDays(client.schedules.map((s) => s.day));
    setSelectedSlot({
      day: client.schedules[0].day,
      time: client.schedules[0].start,
    });
    setIsModalOpen(true);
  };

  const handleSave = (startTime) => {
    if (!clientName || !selectedDays.length) return;

    const client = {
      id: editingClient?.id || Date.now().toString(),
      name: clientName,
      schedules: selectedDays.map((day) => ({
        day,
        start: startTime,
        end: addOneHour(startTime),
      })),
    };

    editingClient ? onUpdateClient(client) : onAddClient(client);
    setIsModalOpen(false);
  };

  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* Selector de día */}
      <div style={daySelector}>
        {DAYS.map((d) => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            style={{
              ...dayBtn,
              ...(selectedDay === d.key ? dayBtnActive : {}),
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Slots */}
      {TIME_SLOTS.map((time) => {
        const list = getClientsInSlot(selectedDay, time);
        const isFull = list.length >= MAX_CLIENTS_PER_SLOT;

        return (
          <div
            key={time}
            onClick={() => openNew(time)}
            style={{
              ...slotRow,
              background: isFull
                ? "rgba(196,22,28,0.15)"
                : "var(--bg-card)",
              borderColor: isFull
                ? "var(--red-500)"
                : "var(--border-subtle)",
            }}
          >
            <div style={slotTime}>{time}</div>

            <div style={slotClients}>
              {list.map((c) => (
                <span
                  key={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(c);
                  }}
                  style={clientChip}
                >
                  {c.name}
                </span>
              ))}
            </div>

            <div
              style={{
                ...slotCount,
                color: isFull
                  ? "var(--red-500)"
                  : "var(--text-secondary)",
              }}
            >
              {list.length}/{MAX_CLIENTS_PER_SLOT}
            </div>
          </div>
        );
      })}

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={
          editingClient ? () => onDeleteClient(editingClient.id) : null
        }
        clientName={clientName}
        setClientName={setClientName}
        selectedSlot={selectedSlot}
        selectedDays={selectedDays}
        toggleDay={toggleDay}
        days={DAYS}
        isEditing={!!editingClient}
      />
    </div>
  );
}

/* ===============================
   ESTILOS
   =============================== */

const daySelector = {
  display: "flex",
  gap: 6,
  marginBottom: 14,
};

const dayBtn = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "1px solid var(--border-subtle)",
  background: "var(--bg-panel)",
  color: "var(--text-secondary)",
  fontWeight: 600,
  cursor: "pointer",
};

const dayBtnActive = {
  background: "var(--red-500)",
  borderColor: "var(--red-500)",
  color: "#ffffff",
};

const slotRow = {
  display: "flex",
  gap: 12,
  padding: "8px 12px",
  border: "1px solid var(--border-subtle)",
  borderRadius: 10,
  marginBottom: 6,
  cursor: "pointer",
  alignItems: "center",
};

const slotTime = {
  width: 70,
  fontWeight: 700,
  fontSize: 13,
  color: "var(--text-primary)",
};

const slotClients = {
  flex: 1,
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
};

const clientChip = {
  background: "var(--red-500)",
  color: "#ffffff",
  padding: "3px 8px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
};

const slotCount = {
  fontSize: 12,
  fontWeight: 600,
};

/* ===============================
   UTILS
   =============================== */

function addOneHour(time) {
  const [h, m] = time.split(":").map(Number);
  return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
