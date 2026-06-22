"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [senha, setSenha] = useState("");
  const [manter, setManter] = useState(true);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function entrar(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ senha, manter }),
      });
      if (res.ok) {
        router.replace("/");
        router.refresh();
      } else {
        setErro("Senha incorreta.");
        setLoading(false);
      }
    } catch (e) {
      setErro("Erro ao entrar. Tente de novo.");
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={entrar}>
        <h1>Lancheteria Rondon</h1>
        <p>Painel financeiro · acesso restrito</p>
        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite a senha"
          autoFocus
          autoComplete="current-password"
        />
        <label className="row">
          <input type="checkbox" checked={manter} onChange={(e) => setManter(e.target.checked)} />
          Manter conectado neste aparelho
        </label>
        <button type="submit" disabled={loading}>{loading ? "Entrando…" : "Entrar"}</button>
        {erro && <div className="err">{erro}</div>}
      </form>
    </div>
  );
}
