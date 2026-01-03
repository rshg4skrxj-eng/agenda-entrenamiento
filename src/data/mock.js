export const DAYS = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
];

export const TIME_SLOTS = [
  "07:00", "07:30",
  "08:00", "08:30",
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00", "17:30",
  "18:00", "18:30",
  "19:00", "19:30",
  "20:00", "20:30",
  "21:00",
];

export const MAX_CLIENTS_PER_SLOT = 4;

export const mockClients = [{
    id: "1",
    name: "Marcos",
    schedules: [
      { day: "monday", start: "07:00", end: "08:00" },
      { day: "wednesday", start: "07:00", end: "08:00" },
      { day: "friday", start: "07:00", end: "08:00" },
    ],
  },
];
