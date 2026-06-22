import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic"; // sempre dados frescos

async function getData() {
  const url = process.env.N8N_DATA_URL;
  if (!url) return { rows: [], erro: "N8N_DATA_URL não configurada" };
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { rows: [], erro: "Falha ao buscar dados (" + res.status + ")" };
    const data = await res.json();
    const rows = Array.isArray(data) ? data : (data.data || []);
    return { rows, erro: null };
  } catch (e) {
    return { rows: [], erro: "Erro de conexão com a fonte de dados" };
  }
}

export default async function Page() {
  const { rows, erro } = await getData();
  return <Dashboard rows={rows} erro={erro} />;
}
