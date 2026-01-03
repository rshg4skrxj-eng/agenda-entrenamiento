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

  // RESET CORRECTO
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
      { day: "monday", start: "07:00" },
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

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={title}>
          {client ? "Editar cliente" : "Nuevo cliente"}
        </h2>

        <label style={label}>Nombre del cliente</label>
        <input
          style={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label style={label}>Horarios</label>

        {schedules.map((s, i) => (
          <div key={i} style={row}>
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
              style={removeBtn}
              onClick={() => removeSchedule(i)}
            >
              ✕
            </button>
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
              Eliminar
            </button>
          )}

          <button style={cancelBtn} onClick={onClose}>
            Cancelar
          </button>

          <button style={saveBtn} onClick={save}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== estilos (coherentes con la app) ===== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modal = {
  background: "#ffffff",
  padding: 20,
  borderRadius: 14,
  width: 440,
};

const title = {
  margin: 0,
  marginBottom: 12,
  fontSize: 20,
  fontWeight: 800,
};

const label = {
  fontSize: 13,
  fontWeight: 700,
  marginTop: 10,
  marginBottom: 4,
};

const input = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
};

const row = {
  display: "flex",
  gap: 6,
  alignItems: "center",
  marginBottom: 6,
};

const select = {
  flex: 1,
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
};

const removeBtn = {
  background: "#b91c1c",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
};

const addBtn = {
  marginTop: 8,
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  fontWeight: 700,
};

const actions = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 16,
};

const cancelBtn = {
  background: "#f1f5f9",
  color: "#0f172a",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "8px 14px",
  fontWeight: 700,
};

const saveBtn = {
  background: "#0f172a",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontWeight: 800,
};

const deleteBtn = {
  background: "#b91c1c",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  fontWeight: 800,
};
