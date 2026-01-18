import { DAYS, TIME_SLOTS } from "../data/mock";

const HOUR_HEIGHT = 48;
const HEADER_HEIGHT = 40;

const SESSION_COLORS = [
  "linear-gradient(180deg, #c4161c, #a91217)",
  "linear-gradient(180deg, #ef4444, #c4161c)",
  "linear-gradient(180deg, #991b1b, #7f1d1d)",
  "linear-gradient(180deg, #f87171, #dc2626)",
];

export default function WeeklyView({ clients, onEditClient }) {
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

  const heightFromRange = (start, end, hasNote) => {
    const base =
      ((minutes(end) - minutes(start)) / 60) * HOUR_HEIGHT;

    // 🔴 ALTURA MÍNIMA PARA QUE ENTRE LA NOTA
    return Math.max(base, hasNote ? 64 : 48);
  };

  const sessionsByDay = (day) =>
    clients.flatMap(client =>
      client.schedules
        .filter(s => s.day === day)
        .map(s => ({
          client,
          start: s.start,
          end: addOneHour(s.start),
          note: s.note || "",
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "70px repeat(6, 1fr)",
        gridTemplateRows: `${HEADER_HEIGHT}px ${gridHeight}px`,
        background: "var(--black-900)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div style={{ background: "var(--black-800)" }} />

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
                      height: heightFromRange(
                        s.start,
                        s.end,
                        !!s.note
                      ),
                      left: `${colIndex * columnWidth}%`,
                      width: `${columnWidth}%`,
                      background:
                        SESSION_COLORS[colIndex % SESSION_COLORS.length],
                    }}
                    onClick={() => onEditClient(s.client)}
                  >
                    <div style={content}>
                      <div style={name}>{s.client.name}</div>
                      <div style={time}>{s.start}</div>
                      {s.note && <div style={note}>{s.note}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== estilos ===== */

const dayHeader = {
  background: "var(--black-800)",
  color: "var(--text-primary)",
  fontWeight: 600,
  fontSize: 13,
  display: "flex",
  alignItems: "center",
  paddingLeft: 10,
  borderLeft: "1px solid var(--border-subtle)",
};

const hoursCol = {
  background: "var(--black-800)",
  borderRight: "1px solid var(--border-subtle)",
};

const hourCell = {
  color: "var(--text-secondary)",
  fontWeight: 500,
  fontSize: 12,
  padding: "6px 8px",
};

const dayCol = {
  borderLeft: "1px solid var(--border-subtle)",
};

const session = {
  position: "absolute",
  borderRadius: 8,
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
};

const content = {
  padding: "6px 8px",
};

const name = {
  fontSize: 12,
  fontWeight: 600,
  color: "#ffffff",
};

const time = {
  fontSize: 11,
  color: "rgba(255,255,255,0.9)",
};

const note = {
  fontSize: 10,
  marginTop: 2,
  color: "rgba(255,255,255,0.8)",
};

function addOneHour(time) {
  const [h, m] = time.split(":").map(Number);
  return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
