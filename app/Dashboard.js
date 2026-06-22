"use client";
import { useMemo, useState } from "react";

const brl = (n) =>
  Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const ym = (iso) => (iso || "").slice(0, 7);
const labelMes = (k) => { const [y, m] = k.split("-"); return MESES[Number(m) - 1] + "/" + y; };
const dataBR = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
};
// normaliza nome p/ agrupar (sem acento, maiúsculo, espaços colapsados)
const norm = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/\s+/g, " ").trim();

export default function Dashboard({ rows = [], erro = null }) {
  const data = useMemo(() => rows.map((r) => ({ ...r, valor: Number(r.valor || 0) })), [rows]);
  const meses = useMemo(
    () => Array.from(new Set(data.map((r) => ym(r.data_transacao)))).filter(Boolean).sort().reverse(),
    [data]
  );

  const [mes, setMes] = useState("todos");
  const [tipo, setTipo] = useState("todos");
  const [nome, setNome] = useState("");
  const [view, setView] = useState("lista"); // "lista" | "nomes"

  // nomes sugeridos respeitam o tipo + mês selecionados
  const nomes = useMemo(() => {
    const src = data
      .filter((r) => (tipo === "todos" || r.tipo === tipo))
      .filter((r) => (mes === "todos" || ym(r.data_transacao) === mes));
    return Array.from(new Set(src.map((r) => (r.contraparte || "").trim()).filter(Boolean))).sort();
  }, [data, tipo, mes]);

  const nq = norm(nome);
  const base = data
    .filter((r) => (mes === "todos" || ym(r.data_transacao) === mes))
    .filter((r) => (tipo === "todos" || r.tipo === tipo))
    .filter((r) => (!nq || norm(r.contraparte).includes(nq)));

  const ordenado = [...base].sort((a, b) => (b.data_transacao || "").localeCompare(a.data_transacao || ""));

  const entradas = base.filter((r) => r.tipo === "entrada");
  const saidas = base.filter((r) => r.tipo === "saida");
  const totEnt = entradas.reduce((s, r) => s + r.valor, 0);
  const totSai = saidas.reduce((s, r) => s + r.valor, 0);
  const saldo = totEnt - totSai;

  const grupos = useMemo(() => {
    const m = new Map();
    for (const r of base) {
      const k = norm(r.contraparte) || "(sem nome)";
      if (!m.has(k)) m.set(k, { nome: r.contraparte || "(sem nome)", qtd: 0, ent: 0, sai: 0 });
      const g = m.get(k);
      g.qtd++;
      if (r.tipo === "entrada") g.ent += r.valor; else g.sai += r.valor;
    }
    return Array.from(m.values()).sort((a, b) => (b.ent + b.sai) - (a.ent + a.sai));
  }, [base]);

  return (
    <div className="wrap">
      <div className="topbar">
        <div>
          <div className="h1">Lancheteria Rondon — Financeiro</div>
          <div className="sub">Entradas e saídas (Mercado Pago) · {data.length} transações</div>
        </div>
        <a className="sairbtn" href="/api/logout">Sair</a>
      </div>

      {erro && <div className="empty" style={{ color: "var(--red)" }}>⚠️ {erro}</div>}

      <div className="filters">
        <select value={mes} onChange={(e) => setMes(e.target.value)}>
          <option value="todos">Todos os meses</option>
          {meses.map((m) => (<option key={m} value={m}>{labelMes(m)}</option>))}
        </select>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="todos">Entradas e saídas</option>
          <option value="entrada">Só entradas</option>
          <option value="saida">Só saídas</option>
        </select>
        <input
          list="nomes-list"
          placeholder="Filtrar por nome…"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <datalist id="nomes-list">
          {nomes.map((n) => (<option key={n} value={n} />))}
        </datalist>
        {nome && <button className="clearbtn" onClick={() => setNome("")}>limpar nome ✕</button>}
        <div className="toggle" style={{ marginLeft: "auto" }}>
          <button className={view === "lista" ? "on" : ""} onClick={() => setView("lista")}>Transações</button>
          <button className={view === "nomes" ? "on" : ""} onClick={() => setView("nomes")}>Por beneficiário</button>
        </div>
      </div>

      <div className="cards">
        <div className="card">
          <div className="label">Entradas</div>
          <div className="value green">{brl(totEnt)}</div>
          <div className="count">{entradas.length} transações</div>
        </div>
        <div className="card">
          <div className="label">Saídas</div>
          <div className="value red">{brl(totSai)}</div>
          <div className="count">{saidas.length} transações</div>
        </div>
        <div className="card">
          <div className="label">Saldo</div>
          <div className={"value " + (saldo >= 0 ? "green" : "red")}>{brl(saldo)}</div>
          <div className="count">{nome ? "filtrado por “" + nome + "”" : "entradas − saídas"}</div>
        </div>
      </div>

      {view === "lista" ? (
        <div className="list2">
          {ordenado.map((r, i) => (
            <div className="item" key={r.id || i}>
              <div className="item-main">
                <div className="item-nome">{r.contraparte || "—"}</div>
                <div className="item-meta">
                  <span className={"tag " + r.tipo}>{r.tipo === "entrada" ? "Entrada" : "Saída"}</span>
                  <span>{dataBR(r.data_transacao)}</span>
                </div>
              </div>
              <div className={"item-val val " + r.tipo}>
                {r.tipo === "saida" ? "− " : "+ "}{brl(r.valor)}
              </div>
            </div>
          ))}
          {ordenado.length === 0 && !erro && (
            <div className="empty">Nenhuma transação no filtro selecionado.</div>
          )}
        </div>
      ) : (
        <div className="list2">
          {grupos.map((g, i) => (
            <div className="item rowlink" key={i} onClick={() => { setNome(g.nome); setView("lista"); }} title="Ver as transações deste nome">
              <div className="item-main">
                <div className="item-nome">{g.nome}</div>
                <div className="item-meta">{g.qtd} {g.qtd === 1 ? "transação" : "transações"}</div>
              </div>
              <div className="item-val">
                {g.ent ? <span className="val entrada">+ {brl(g.ent)}</span> : null}
                {g.sai ? <span className="val saida">− {brl(g.sai)}</span> : null}
              </div>
            </div>
          ))}
          {grupos.length === 0 && !erro && (
            <div className="empty">Nada para agrupar no filtro selecionado.</div>
          )}
        </div>
      )}
    </div>
  );
}
