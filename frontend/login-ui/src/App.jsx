import { useState } from "react";

export default function App() {
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("1234");
  const [token, setToken] = useState("");
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  //const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5023"; // 注意你的後端是 5023
  const apiBase = import.meta.env.VITE_API_BASE;
  console.log("VITE_API_BASE =", import.meta.env.VITE_API_BASE);
  const login = async () => {
    setErr("");
    setMe(null);

    const res = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setErr("Login failed");
      return;
    }

    const data = await res.json();
    setToken(data.token);
  };

  const getMe = async () => {
    setErr("");

    const res = await fetch(`${apiBase}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      setErr("Unauthorized");
      return;
    }

    setMe(await res.json());
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Login Demo</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button onClick={login}>Login</button>

        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Token</div>
          <div style={{ wordBreak: "break-all" }}>{token || "-"}</div>
        </div>

        <button onClick={getMe} disabled={!token}>
          Get /me
        </button>

        {me && (
          <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 8 }}>
            {JSON.stringify(me, null, 2)}
          </pre>
        )}

        {err && <div style={{ color: "crimson" }}>{err}</div>}
      </div>
    </div>
  );
}
