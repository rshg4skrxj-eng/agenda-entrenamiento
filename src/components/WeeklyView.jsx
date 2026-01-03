import { useState } from "react";
import { DAYS, TIME_SLOTS } from "../data/mock";
import ClientModal from "./ClientModal";

const HOUR_HEIGHT = 48;
const HEADER_HEIGHT = 40;

const COLORS = [
  "#dc2626",
  "#ef4444",
  "#b91c1c",
  "#f87171",
];

export default function WeeklyView({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const hours = [...new Set(TIME_SLOTS.map(t => t.split(":")[0]))];

  const minutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const topFromTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const idx = hours.indexOf(String(h).padStart(2, "0"));
    return idx * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
  };

  const heightFromRange = (start, end) =>
    ((minutes(end) - minutes(start)) / 60) * HOUR_HEIGHT;

  const sessionsByDay = (day) =>
    clients.flatMap(client =>
      client.schedules
        .filter(s => s.day === day)
        .map(s => ({
          client,
          start: s.start,
          end: addOneHour(s.start),
        }))
    );

  const stackSessions = (sessions) => {
    const stacks = [];

    sessions
      .sort((a, b) => minutes(a.start) - minutes(b.start))
      .forEach(session => {
        let placed = false;

        for (const stack of stacks) {
          const last = stack[stack.length - 1];
          if (minutes(session.start) >= minutes(last.end)) {
            stack.push(session);
            placed = true;
            break;
          }
        }

        if (!placed) stacks.push([session]);
      });

    return stacks;
  };

  const gridHeight = hours.length * HOUR_HEIGHT;

  return (
    <div>
      <button
        style={addClientBtn}
        onClick={() => {
          setEditingClient(null);
          setIsModalOpen(true);
        }}
      >
        + Agregar cliente
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "70px repeat(6, 1fr)",
          gridTemplateRows: `${HEADER_HEIGHT}px ${gridHeight}px`,
          background: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div style={{ background: "#111827" }} />

        {DAYS.map(d => (
          <div key={d.key} style={dayHeader}>
            {d.label}
          </div>
        ))}

        <div style={hoursCol}>
          {hours.map(h => (
            <div key={h} style={{ ...hourCell, height: HOUR_HEIGHT }}>
              {h}:00
            </div>
          ))}
        </div>

        {DAYS.map(day => {
          const sessions = sessionsByDay(day.key);
          const stacks = stackSessions(sessions);
          const columnWidth = 100 / stacks.length;

          return (
            <div key={day.key} style={dayCol}>
              <div style={{ position: "relative", height: gridHeight }}>
                {stacks.map((stack, colIndex) =>
                  stack.map((s) => (
                    <div
                      key={s.client.id + s.start}
                      style={{
                        ...session,
                        top: topFromTime(s.start),
                        height: heightFromRange(s.start, s.end),
                        left: `${colIndex * columnWidth}%`,
                        width: `${columnWidth}%`,
                        background:
                          COLORS[colIndex % COLORS.length],
                      }}
                      onClick={() => {
                        setEditingClient(s.client);
                        setIsModalOpen(true);
                      }}
                    >
                      <div style={content}>
                        <div style={name}>{s.client.name}</div>
                        <div style={time}>{s.start}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ClientModal
        isOpen={isModalOpen}
        client={editingClient}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onSave={(c) =>
          editingClient ? onUpdateClient(c) : onAddClient(c)
        }
        onDelete={(id) => {
          onDeleteClient(id);
          setIsModalOpen(false);
          setEditingClient(null);
        }}
      />
    </div>
  );
}

/* estilos */

const addClientBtn = {
  marginBottom: 12,
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  fontWeight: 700,
};

const dayHeader = {
  background: "#111827",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 13,
  display: "flex",
  alignItems: "center",
  paddingLeft: 8,
};

const hoursCol = { background: "#1f2937" };

const hourCell = {
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 13,
  padding: "6px 8px",
};

const dayCol = {
  borderLeft: "1px solid #e5e7eb",
};

const session = {
  position: "absolute",
  borderRadius: 6,
  boxSizing: "border-box",
  cursor: "pointer",
};

const content = {
  padding: "4px 6px",
};

const name = {
  fontSize: 12,
  fontWeight: 700,
  color: "#ffffff",
};

const time = {
  fontSize: 11,
  color: "#ffffff",
};

function addOneHour(time) {
  const [h, m] = time.split(":").map(Number);
  return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
