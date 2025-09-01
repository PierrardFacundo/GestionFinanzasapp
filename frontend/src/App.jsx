import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:4000/api/health")
      .then(r => r.json())
      .then(d => setStatus(d.ok ? "Backend OK" : "Backend DOWN"))
      .catch(() => setStatus("Error conectando al backend"));
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Finance Tracker</h1>
      <p>Vista inicial funcionando ✅</p>
      <p><strong>Estado del backend:</strong> {status}</p>
    </div>
  );
}

export default App;


