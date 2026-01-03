export function Tabs({ children }) {
  return <div>{children}</div>;
}

export function TabsList({ children }) {
  return <div style={{ display: "flex", gap: "8px" }}>{children}</div>;
}

export function TabsTrigger({ children, value }) {
  return <button>{children}</button>;
}

export function TabsContent({ children }) {
  return <div>{children}</div>;
}
