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
    <div style={{ color: "#111827" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {DAYS.map((d) => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            style={{
              padding: "6px 12px",
              background: selectedDay === d.key ? "#dc2626" : "#e5e7eb",
              color: selectedDay === d.key ? "#ffffff" : "#111827",
              border: "none",
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {TIME_SLOTS.map((time) => {
        const list = getClientsInSlot(selectedDay, time);
        return (
          <div
            key={time}
            onClick={() => openNew(time)}
            style={{
              display: "flex",
              gap: 12,
              padding: "8px 12px",
              border: "1px solid #9ca3af",
              borderRadius: 6,
              marginBottom: 6,
              cursor: "pointer",
              background:
                list.length >= MAX_CLIENTS_PER_SLOT
                  ? "#fee2e2"
                  : "#ffffff",
            }}
          >
            <div style={{ width: 70, fontWeight: 800, color: "#111827" }}>
              {time}
            </div>

            <div style={{ flex: 1 }}>
              {list.map((c) => (
                <span
                  key={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(c);
                  }}
                  style={{
                    background: "#dc2626",
                    color: "#ffffff",
                    padding: "2px 6px",
                    borderRadius: 4,
                    marginRight: 6,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {c.name}
                </span>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>
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

function addOneHour(time) {
  const [h, m] = time.split(":").map(Number);
  return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
