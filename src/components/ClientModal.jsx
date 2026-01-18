import { useState, useEffect } from "react";
import { DAYS, TIME_SLOTS } from "../data/mock";

export default function ClientModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  client,
}) {
  const [name, setName] = useState("");
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    if (client) {
      setName(client.name);
      setSchedules(client.schedules);
    } else {
      setName("");
      setSchedules([]);
    }
  }, [isOpen, client]);

  if (!isOpen) return null;

  const updateSchedule = (index, key, value) => {
    const copy = [...schedules];
    copy[index][key] = value;
    setSchedules(copy);
  };

  const addSchedule = () => {
    setSchedules((prev) => [
      ...prev,
      { day: "monday", start: "07:00", note: "" },
    ]);
  };

  const removeSchedule = (index) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    if (!name || schedules.length === 0) return;

    onSave({
      id: client?.id || Date.now().toString(),
      name,
      schedules,
    });

    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }
  };

  return (
    <div style={overlay}>
      <div style={modal} onKeyDown={handleKeyDown} tabIndex={-1}>
        <h2 style={title}>
          {client ? "Editar cliente" : "Nuevo cliente"}
        </h2>

        <label style={label}>Nombre del cliente</label>
        <input
          style={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo"
        />

        <label style={label}>Horarios</label>

        {schedules.map((s, i) => (
          <div key={i} style={scheduleBlock}>
            <div style={row}>
              <select
                style={select}
                value={s.day}
                onChange={(e) =>
                  updateSchedule(i, "day", e.target.value)
                }
              >
                {DAYS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label}
                  </option>
                ))}
              </select>

              <select
                style={select}
                value={s.start}
                onChange={(e) =>
                  updateSchedule(i, "start", e.target.value)
                }
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <button
                style={removeScheduleBtn}
                onClick={() => removeSchedule(i)}
                title="Eliminar horario"
              >
                ✕
              </button>
            </div>

            <input
              style={input}
              placeholder="Nota (opcional)"
              value={s.note || ""}
              onChange={(e) =>
                updateSchedule(i, "note", e.target.value)
              }
            />
          </div>
        ))}

        <button style={addBtn} onClick={addSchedule}>
          + Agregar horario
        </button>

        <div style={actions}>
          {client && (
            <button
              style={deleteBtn}
              onClick={() => {
                onDelete(client.id);
                onClose();
              }}
            >
              Eliminar cliente
            </button>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button style={cancelBtn} onClick={onClose}>
              Cancelar
            </button>

            <button style={saveBtn} onClick={save}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   ESTILOS
   =============================== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modal = {
  background: "var(--black-800)",
  color: "var(--text-primary)",
  padding: 22,
  borderRadius: 16,
  width: 460,
  border: "1px solid var(--border-subtle)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
  outline: "none",
};

const title = {
  margin: 0,
  marginBottom: 14,
  fontSize: 20,
  fontWeight: 700,
};

const label = {
  fontSize: 12,
  fontWeight: 600,
  marginTop: 12,
  marginBottom: 6,
  color: "var(--text-secondary)",
};

const input = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 10,
  border: "1px solid var(--border-subtle)",
  background: "var(--bg-panel)",
  color: "var(--text-primary)",
};

const scheduleBlock = {
  marginBottom: 12,
};

const row = {
  display: "flex",
  gap: 6,
  alignItems: "center",
  marginBottom: 6,
};

const select = {
  flex: 1,
  padding: "9px 11px",
  borderRadius: 10,
  border: "1px solid var(--border-subtle)",
  background: "var(--bg-panel)",
  color: "var(--text-primary)",
};

const removeScheduleBtn = {
  background: "transparent",
  color: "var(--red-500)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
  fontWeight: 700,
};

const addBtn = {
  marginTop: 10,
  padding: "8px 14px",
  borderRadius: 10,
  border: "1px solid var(--border-subtle)",
  background: "var(--black-900)",
  color: "var(--text-primary)",
  fontWeight: 600,
};

const actions = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 20,
};

const cancelBtn = {
  background: "transparent",
  color: "var(--text-secondary)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 10,
  padding: "8px 14px",
  fontWeight: 600,
};

const saveBtn = {
  background: "var(--red-500)",
  color: "#ffffff",
  border: "none",
  borderRadius: 10,
  padding: "8px 18px",
  fontWeight: 700,
};

const deleteBtn = {
  background: "transparent",
  color: "var(--red-500)",
  border: "1px solid var(--red-500)",
  borderRadius: 10,
  padding: "8px 14px",
  fontWeight: 600,
};
