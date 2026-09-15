import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  Building2,
  Map as MapIcon,
  Clock,
  AlertTriangle,
  BarChart3,
  FileText,
  ChevronRight,
  Search,
  Check,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------
const COLORS = {
  bg: "#F5F4F0",
  surface: "#FFFFFF",
  ink: "#20242B",
  inkSoft: "#5B6169",
  inkFaint: "#8B9099",
  border: "#E3E0D7",
  navy: "#16213E",
  navySoft: "#243257",
  navyLine: "#31406B",
  teal: "#3F7D68",
  tealBg: "#E7F0EB",
  copper: "#C1622E",
  copperBg: "#F7E9E1",
  amber: "#B98A2E",
  amberBg: "#F6EEDD",
  slate: "#7A8494",
  slateBg: "#EEEDE7",
};

const FONT_HEAD = '"Space Grotesk", "IBM Plex Sans", sans-serif';
const FONT_BODY = '"IBM Plex Sans", sans-serif';

// ---------------------------------------------------------------------------
// Dados simulados
// ---------------------------------------------------------------------------
const REPS = [
  { id: "r1", nome: "Marina Costa", regiao: "Zona Sul", status: "em_rota", planejadas: 8, realizadas: 5 },
  { id: "r2", nome: "Rafael Andrade", regiao: "Zona Norte", status: "em_atendimento", planejadas: 7, realizadas: 6 },
  { id: "r3", nome: "Bruno Tavares", regiao: "Grande ABC", status: "parado", planejadas: 6, realizadas: 2 },
  { id: "r4", nome: "Camila Duarte", regiao: "Zona Leste", status: "em_rota", planejadas: 9, realizadas: 7 },
  { id: "r5", nome: "Felipe Nogueira", regiao: "Zona Oeste", status: "offline", planejadas: 6, realizadas: 1 },
  { id: "r6", nome: "Juliana Prado", regiao: "Litoral", status: "em_rota", planejadas: 8, realizadas: 8 },
  { id: "r7", nome: "Diego Ramos", regiao: "Interior 1", status: "em_atendimento", planejadas: 7, realizadas: 4 },
  { id: "r8", nome: "Larissa Meireles", regiao: "Interior 2", status: "em_rota", planejadas: 8, realizadas: 6 },
];

const STATUS_REP_LABEL = {
  em_rota: "Em rota",
  em_atendimento: "Em atendimento",
  parado: "Parado",
  offline: "Offline",
};
const STATUS_REP_COLOR = {
  em_rota: COLORS.teal,
  em_atendimento: "#3477B0",
  parado: COLORS.amber,
  offline: COLORS.inkFaint,
};

const CLIENTES = [
  { id: "c1", nome: "Mercado Bom Preço", regiao: "Zona Sul", ultimaVisitaDias: 4, carteira: "Marina Costa" },
  { id: "c2", nome: "Distribuidora Rio Claro", regiao: "Interior 1", ultimaVisitaDias: 38, carteira: "Diego Ramos" },
  { id: "c3", nome: "Padaria Central", regiao: "Zona Norte", ultimaVisitaDias: 12, carteira: "Rafael Andrade" },
  { id: "c4", nome: "Atacado Litoral Sul", regiao: "Litoral", ultimaVisitaDias: 2, carteira: "Juliana Prado" },
  { id: "c5", nome: "Farmácia Vitalle", regiao: "Grande ABC", ultimaVisitaDias: 61, carteira: "Bruno Tavares" },
  { id: "c6", nome: "Supermercado União", regiao: "Zona Leste", ultimaVisitaDias: 6, carteira: "Camila Duarte" },
  { id: "c7", nome: "Mini Mercado Aurora", regiao: "Zona Oeste", ultimaVisitaDias: 45, carteira: "Felipe Nogueira" },
  { id: "c8", nome: "Comercial Serra Azul", regiao: "Interior 2", ultimaVisitaDias: 9, carteira: "Larissa Meireles" },
  { id: "c9", nome: "Restaurante Sabor Caseiro", regiao: "Zona Sul", ultimaVisitaDias: 21, carteira: "Marina Costa" },
  { id: "c10", nome: "Depósito Nova Era", regiao: "Zona Norte", ultimaVisitaDias: 3, carteira: "Rafael Andrade" },
];

const VISITAS = [
  { id: "v1", vendedor: "Marina Costa", cliente: "Mercado Bom Preço", hora: "08:30", status: "realizada", duracaoMin: 28 },
  { id: "v2", vendedor: "Marina Costa", cliente: "Restaurante Sabor Caseiro", hora: "10:15", status: "realizada", duracaoMin: 19 },
  { id: "v3", vendedor: "Marina Costa", cliente: "Empório da Vila", hora: "14:00", status: "planejada", duracaoMin: null },
  { id: "v4", vendedor: "Rafael Andrade", cliente: "Padaria Central", hora: "09:00", status: "realizada", duracaoMin: 22 },
  { id: "v5", vendedor: "Rafael Andrade", cliente: "Depósito Nova Era", hora: "11:30", status: "em_andamento", duracaoMin: null },
  { id: "v6", vendedor: "Bruno Tavares", cliente: "Farmácia Vitalle", hora: "09:30", status: "nao_realizada", duracaoMin: null, motivo: "Cliente fechado" },
  { id: "v7", vendedor: "Bruno Tavares", cliente: "Auto Peças Tavares", hora: "13:00", status: "planejada", duracaoMin: null },
  { id: "v8", vendedor: "Camila Duarte", cliente: "Supermercado União", hora: "08:00", status: "realizada", duracaoMin: 34 },
  { id: "v9", vendedor: "Camila Duarte", cliente: "Mercadinho Leste", hora: "10:45", status: "realizada", duracaoMin: 15 },
  { id: "v10", vendedor: "Felipe Nogueira", cliente: "Mini Mercado Aurora", hora: "09:15", status: "nao_realizada", duracaoMin: null, motivo: "Sem retorno do cliente" },
  { id: "v11", vendedor: "Juliana Prado", cliente: "Atacado Litoral Sul", hora: "08:45", status: "realizada", duracaoMin: 40 },
  { id: "v12", vendedor: "Juliana Prado", cliente: "Peixaria do Porto", hora: "11:00", status: "realizada", duracaoMin: 18 },
  { id: "v13", vendedor: "Diego Ramos", cliente: "Distribuidora Rio Claro", hora: "10:00", status: "em_andamento", duracaoMin: null },
  { id: "v14", vendedor: "Larissa Meireles", cliente: "Comercial Serra Azul", hora: "08:15", status: "realizada", duracaoMin: 26 },
  { id: "v15", vendedor: "Larissa Meireles", cliente: "Mercado Serrano", hora: "13:30", status: "planejada", duracaoMin: null },
];

const STATUS_VISITA = {
  realizada: { label: "Realizada", color: COLORS.teal, bg: COLORS.tealBg },
  em_andamento: { label: "Em andamento", color: "#3477B0", bg: "#E3EEF7" },
  planejada: { label: "Planejada", color: COLORS.slate, bg: COLORS.slateBg },
  nao_realizada: { label: "Não realizada", color: COLORS.copper, bg: COLORS.copperBg },
};

const PENDENCIAS = [
  { id: "p1", titulo: "Aprovar troca de rota de hoje", vendedor: "Bruno Tavares", prazo: "Hoje, 18h" },
  { id: "p2", titulo: "Validar despesa de combustível", vendedor: "Diego Ramos", prazo: "Amanhã" },
  { id: "p3", titulo: "Confirmar substituição de carteira (licença médica)", vendedor: "Felipe Nogueira", prazo: "Hoje, 12h" },
  { id: "p4", titulo: "Revisar relatório com foto pendente de anexo", vendedor: "Camila Duarte", prazo: "Amanhã" },
  { id: "p5", titulo: "Redistribuir clientes sem visita há 60 dias", vendedor: "Grande ABC", prazo: "Esta semana" },
];

const EXCECOES = [
  { id: "e1", tipo: "Atraso no início da visita", vendedor: "Bruno Tavares", detalhe: "42 min após o horário planejado", severidade: "alta" },
  { id: "e2", tipo: "Check-out fora do raio do cliente", vendedor: "Felipe Nogueira", detalhe: "Registrado a 1,8 km do endereço", severidade: "alta" },
  { id: "e3", tipo: "Visita concluída em menos de 2 min", vendedor: "Diego Ramos", detalhe: "Possível registro indevido", severidade: "media" },
  { id: "e4", tipo: "Visita sem geolocalização", vendedor: "Rafael Andrade", detalhe: "GPS não capturado no check-in", severidade: "media" },
  { id: "e5", tipo: "Rota divergente do planejamento", vendedor: "Bruno Tavares", detalhe: "3 paradas fora da carteira", severidade: "baixa" },
];

const SEVERIDADE_COLOR = {
  alta: { color: COLORS.copper, bg: COLORS.copperBg, label: "Alta" },
  media: { color: COLORS.amber, bg: COLORS.amberBg, label: "Média" },
  baixa: { color: COLORS.slate, bg: COLORS.slateBg, label: "Baixa" },
};

const SERIE_SEMANAL = [
  { semana: "Sem 1", planejadas: 210, realizadas: 178 },
  { semana: "Sem 2", planejadas: 215, realizadas: 190 },
  { semana: "Sem 3", planejadas: 208, realizadas: 165 },
  { semana: "Sem 4", planejadas: 220, realizadas: 201 },
  { semana: "Sem 5", planejadas: 224, realizadas: 196 },
  { semana: "Sem 6", planejadas: 218, realizadas: 205 },
  { semana: "Sem 7", planejadas: 226, realizadas: 199 },
  { semana: "Sem 8", planejadas: 230, realizadas: 214 },
];

const COBERTURA = [
  { nome: "Visitados (30 dias)", valor: 62, cor: COLORS.teal },
  { nome: "Sem visita 30-60 dias", valor: 26, cor: COLORS.amber },
  { nome: "Sem visita 60+ dias", valor: 12, cor: COLORS.copper },
];

const ADERENCIA_POR_REGIAO = REPS.map((r) => ({
  regiao: r.regiao,
  aderencia: Math.round((r.realizadas / r.planejadas) * 100),
}));

const RELATORIOS = [
  { id: "rp1", vendedor: "Marina Costa", cliente: "Mercado Bom Preço", resumo: "Reposição de estoque acordada para a próxima semana.", anexo: true },
  { id: "rp2", vendedor: "Juliana Prado", cliente: "Atacado Litoral Sul", resumo: "Cliente solicitou revisão de tabela de preços.", anexo: true },
  { id: "rp3", vendedor: "Camila Duarte", cliente: "Supermercado União", resumo: "Sem pendências. Próxima visita em 15 dias.", anexo: false },
  { id: "rp4", vendedor: "Larissa Meireles", cliente: "Comercial Serra Azul", resumo: "Cliente relatou atraso recorrente de entregas.", anexo: true },
];

// ---------------------------------------------------------------------------
// Componentes auxiliares
// ---------------------------------------------------------------------------
function Pill({ color, bg, children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 500,
        color,
        background: bg,
        padding: "3px 10px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
      <div>
        <div style={{ fontSize: 13, color: COLORS.inkFaint, marginBottom: 2 }}>{eyebrow}</div>
        <h1 style={{ fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 600, margin: 0, color: COLORS.ink }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

function KpiCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: "16px 18px",
        flex: 1,
        minWidth: 150,
      }}
    >
      <div style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 30, fontWeight: 600, color: accent || COLORS.ink, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12.5, color: COLORS.inkFaint, marginTop: 8 }}>{sub}</div>}
    </div>
  );
}

function Table({ columns, rows }) {
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead>
          <tr style={{ background: "#FAFAF7" }}>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align || "left",
                  padding: "10px 16px",
                  color: COLORS.inkFaint,
                  fontWeight: 500,
                  fontSize: 12.5,
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: "11px 16px", textAlign: c.align || "left", color: COLORS.ink }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Seções
// ---------------------------------------------------------------------------
function Dashboard() {
  const planejadasHoje = REPS.reduce((a, r) => a + r.planejadas, 0);
  const realizadasHoje = REPS.reduce((a, r) => a + r.realizadas, 0);
  const aderencia = Math.round((realizadasHoje / planejadasHoje) * 100);
  const semVisita = CLIENTES.filter((c) => c.ultimaVisitaDias > 30).length;

  return (
    <div>
      <SectionTitle eyebrow="Hoje, 11 de setembro" title="Visão geral da operação" />
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        <KpiCard label="Visitas planejadas hoje" value={planejadasHoje} />
        <KpiCard label="Visitas realizadas" value={realizadasHoje} accent={COLORS.teal} />
        <KpiCard label="Aderência à agenda" value={`${aderencia}%`} accent={aderencia >= 80 ? COLORS.teal : COLORS.amber} />
        <KpiCard label="Clientes sem visita há 30+ dias" value={semVisita} accent={COLORS.copper} />
        <KpiCard label="Exceções abertas" value={EXCECOES.length} accent={COLORS.copper} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 12, color: COLORS.ink }}>
            Visitas planejadas x realizadas — últimas 8 semanas
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={SERIE_SEMANAL}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
              <XAxis dataKey="semana" tick={{ fontSize: 12, fill: COLORS.inkFaint }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: COLORS.inkFaint }} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={{ fontSize: 12.5, borderRadius: 8, border: `1px solid ${COLORS.border}` }} />
              <Legend wrapperStyle={{ fontSize: 12.5 }} />
              <Line type="monotone" dataKey="planejadas" name="Planejadas" stroke={COLORS.slate} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="realizadas" name="Realizadas" stroke={COLORS.teal} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 12, color: COLORS.ink }}>Cobertura da carteira</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={COBERTURA} dataKey="valor" nameKey="nome" innerRadius={45} outerRadius={70} paddingAngle={2}>
                {COBERTURA.map((entry, i) => (
                  <Cell key={i} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12.5, borderRadius: 8, border: `1px solid ${COLORS.border}` }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
            {COBERTURA.map((c) => (
              <div key={c.nome} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: COLORS.inkSoft }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.cor }} />
                {c.nome} — {c.valor}%
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 12, color: COLORS.ink }}>Status da equipe agora</div>
      <Table
        columns={[
          { key: "nome", label: "Vendedor" },
          { key: "regiao", label: "Região" },
          { key: "status", label: "Status", render: (r) => <Pill color={STATUS_REP_COLOR[r.status]} bg="#F2F1EC">{STATUS_REP_LABEL[r.status]}</Pill> },
          { key: "realizadas", label: "Realizadas / planejadas", align: "right", render: (r) => `${r.realizadas} / ${r.planejadas}` },
        ]}
        rows={REPS}
      />
    </div>
  );
}

function Equipe() {
  return (
    <div>
      <SectionTitle eyebrow="8 vendedores ativos" title="Equipe" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {REPS.map((r) => {
          const aderencia = Math.round((r.realizadas / r.planejadas) * 100);
          return (
            <div key={r.id} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14.5, color: COLORS.ink }}>{r.nome}</div>
                  <div style={{ fontSize: 12.5, color: COLORS.inkFaint }}>{r.regiao}</div>
                </div>
                <Pill color={STATUS_REP_COLOR[r.status]} bg="#F2F1EC">{STATUS_REP_LABEL[r.status]}</Pill>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.inkSoft, marginBottom: 6 }}>
                <span>Visitas hoje</span>
                <span style={{ color: COLORS.ink, fontWeight: 500 }}>{r.realizadas}/{r.planejadas}</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: COLORS.slateBg, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(aderencia, 100)}%`, background: aderencia >= 80 ? COLORS.teal : aderencia >= 50 ? COLORS.amber : COLORS.copper }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Agenda() {
  const [filtro, setFiltro] = useState("todos");
  const vendedores = ["todos", ...REPS.map((r) => r.nome)];
  const filtradas = filtro === "todos" ? VISITAS : VISITAS.filter((v) => v.vendedor === filtro);

  return (
    <div>
      <SectionTitle
        eyebrow="Hoje"
        title="Agenda"
        action={
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ fontFamily: FONT_BODY, fontSize: 13, padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, color: COLORS.ink, background: COLORS.surface }}
          >
            {vendedores.map((v) => (
              <option key={v} value={v}>{v === "todos" ? "Todos os vendedores" : v}</option>
            ))}
          </select>
        }
      />
      <Table
        columns={[
          { key: "hora", label: "Horário" },
          { key: "vendedor", label: "Vendedor" },
          { key: "cliente", label: "Cliente" },
          { key: "status", label: "Status", render: (v) => <Pill color={STATUS_VISITA[v.status].color} bg={STATUS_VISITA[v.status].bg}>{STATUS_VISITA[v.status].label}</Pill> },
        ]}
        rows={filtradas}
      />
    </div>
  );
}

function Visitas() {
  const [filtro, setFiltro] = useState("todas");
  const opcoes = ["todas", "realizada", "em_andamento", "planejada", "nao_realizada"];
  const filtradas = filtro === "todas" ? VISITAS : VISITAS.filter((v) => v.status === filtro);

  return (
    <div>
      <SectionTitle eyebrow={`${VISITAS.length} visitas hoje`} title="Visitas" />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {opcoes.map((op) => (
          <button
            key={op}
            onClick={() => setFiltro(op)}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 12.5,
              padding: "6px 14px",
              borderRadius: 999,
              border: `1px solid ${filtro === op ? COLORS.navy : COLORS.border}`,
              background: filtro === op ? COLORS.navy : COLORS.surface,
              color: filtro === op ? "#fff" : COLORS.inkSoft,
              cursor: "pointer",
            }}
          >
            {op === "todas" ? "Todas" : STATUS_VISITA[op].label}
          </button>
        ))}
      </div>
      <Table
        columns={[
          { key: "hora", label: "Horário" },
          { key: "vendedor", label: "Vendedor" },
          { key: "cliente", label: "Cliente" },
          { key: "duracaoMin", label: "Duração", render: (v) => (v.duracaoMin ? `${v.duracaoMin} min` : "—") },
          {
            key: "status",
            label: "Status",
            render: (v) => (
              <div>
                <Pill color={STATUS_VISITA[v.status].color} bg={STATUS_VISITA[v.status].bg}>{STATUS_VISITA[v.status].label}</Pill>
                {v.motivo && <div style={{ fontSize: 11.5, color: COLORS.inkFaint, marginTop: 4 }}>{v.motivo}</div>}
              </div>
            ),
          },
        ]}
        rows={filtradas}
      />
    </div>
  );
}

function Clientes() {
  const [busca, setBusca] = useState("");
  const filtrados = CLIENTES.filter((c) => c.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <SectionTitle
        eyebrow={`${CLIENTES.length} clientes na base`}
        title="Clientes"
        action={
          <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "7px 12px", background: COLORS.surface }}>
            <Search size={15} color={COLORS.inkFaint} />
            <input
              placeholder="Buscar cliente"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ border: "none", outline: "none", fontFamily: FONT_BODY, fontSize: 13, width: 160 }}
            />
          </div>
        }
      />
      <Table
        columns={[
          { key: "nome", label: "Cliente" },
          { key: "regiao", label: "Região" },
          { key: "carteira", label: "Carteira (vendedor)" },
          {
            key: "ultimaVisitaDias",
            label: "Última visita",
            align: "right",
            render: (c) => (
              <span style={{ color: c.ultimaVisitaDias > 30 ? COLORS.copper : COLORS.ink, fontWeight: c.ultimaVisitaDias > 30 ? 500 : 400 }}>
                há {c.ultimaVisitaDias} dias
              </span>
            ),
          },
        ]}
        rows={filtrados}
      />
    </div>
  );
}

function Mapa() {
  // posições ilustrativas — em produção viriam de Google Maps / Mapbox com coordenadas reais
  const posicoes = {
    r1: [22, 68], r2: [52, 18], r3: [78, 52], r4: [70, 30],
    r5: [15, 30], r6: [30, 85], r7: [85, 78], r8: [55, 62],
  };
  return (
    <div>
      <SectionTitle eyebrow="Representação ilustrativa" title="Mapa da operação" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 20 }}>
        <div style={{ position: "relative", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, height: 420, overflow: "hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={"v" + i} x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" stroke={COLORS.border} strokeWidth="0.2" />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={"h" + i} x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} stroke={COLORS.border} strokeWidth="0.2" />
            ))}
          </svg>
          {REPS.map((r) => {
            const [x, y] = posicoes[r.id];
            return (
              <div key={r.id} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: STATUS_REP_COLOR[r.status], border: "2px solid #fff", boxShadow: "0 0 0 1px " + COLORS.border, margin: "0 auto" }} />
                <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 4, whiteSpace: "nowrap", background: "rgba(255,255,255,0.85)", padding: "1px 5px", borderRadius: 4 }}>
                  {r.nome.split(" ")[0]}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: COLORS.ink }}>Legenda</div>
          {Object.entries(STATUS_REP_LABEL).map(([key, label]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: COLORS.inkSoft, marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_REP_COLOR[key] }} />
              {label}
            </div>
          ))}
          <div style={{ fontSize: 12, color: COLORS.inkFaint, marginTop: 16, lineHeight: 1.5 }}>
            Em produção, as posições vêm da localização em tempo real do aplicativo do vendedor, sobre Google Maps ou Mapbox.
          </div>
        </div>
      </div>
    </div>
  );
}

function Pendencias() {
  const [resolvidas, setResolvidas] = useState([]);
  const toggle = (id) => setResolvidas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div>
      <SectionTitle eyebrow={`${PENDENCIAS.length - resolvidas.length} em aberto`} title="Pendências" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {PENDENCIAS.map((p) => {
          const feita = resolvidas.includes(p.id);
          return (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: "14px 16px",
                opacity: feita ? 0.5 : 1,
              }}
            >
              <button
                onClick={() => toggle(p.id)}
                aria-label={feita ? "Reabrir pendência" : "Concluir pendência"}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `1.5px solid ${feita ? COLORS.teal : COLORS.border}`,
                  background: feita ? COLORS.teal : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {feita && <Check size={14} color="#fff" />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: COLORS.ink, textDecoration: feita ? "line-through" : "none" }}>{p.titulo}</div>
                <div style={{ fontSize: 12.5, color: COLORS.inkFaint, marginTop: 2 }}>{p.vendedor}</div>
              </div>
              <div style={{ fontSize: 12.5, color: COLORS.inkSoft, whiteSpace: "nowrap" }}>{p.prazo}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Excecoes() {
  return (
    <div>
      <SectionTitle eyebrow={`${EXCECOES.length} exceções hoje`} title="Exceções" />
      <Table
        columns={[
          { key: "tipo", label: "Tipo" },
          { key: "vendedor", label: "Vendedor" },
          { key: "detalhe", label: "Detalhe" },
          { key: "severidade", label: "Severidade", render: (e) => <Pill color={SEVERIDADE_COLOR[e.severidade].color} bg={SEVERIDADE_COLOR[e.severidade].bg}>{SEVERIDADE_COLOR[e.severidade].label}</Pill> },
        ]}
        rows={EXCECOES}
      />
    </div>
  );
}

function Indicadores() {
  return (
    <div>
      <SectionTitle eyebrow="Últimas 8 semanas" title="Indicadores" />
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "18px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 12, color: COLORS.ink }}>Aderência à agenda por região (hoje)</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={ADERENCIA_POR_REGIAO} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: COLORS.inkFaint }} axisLine={false} tickLine={false} unit="%" />
            <YAxis type="category" dataKey="regiao" tick={{ fontSize: 12, fill: COLORS.inkSoft }} axisLine={false} tickLine={false} width={100} />
            <Tooltip contentStyle={{ fontSize: 12.5, borderRadius: 8, border: `1px solid ${COLORS.border}` }} formatter={(v) => `${v}%`} />
            <Bar dataKey="aderencia" radius={[0, 4, 4, 0]}>
              {ADERENCIA_POR_REGIAO.map((d, i) => (
                <Cell key={i} fill={d.aderencia >= 80 ? COLORS.teal : d.aderencia >= 50 ? COLORS.amber : COLORS.copper} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 12, color: COLORS.ink }}>Evolução de visitas planejadas x realizadas</div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={SERIE_SEMANAL}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
            <XAxis dataKey="semana" tick={{ fontSize: 12, fill: COLORS.inkFaint }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: COLORS.inkFaint }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={{ fontSize: 12.5, borderRadius: 8, border: `1px solid ${COLORS.border}` }} />
            <Legend wrapperStyle={{ fontSize: 12.5 }} />
            <Line type="monotone" dataKey="planejadas" name="Planejadas" stroke={COLORS.slate} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="realizadas" name="Realizadas" stroke={COLORS.teal} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Relatorios() {
  return (
    <div>
      <SectionTitle eyebrow={`${RELATORIOS.length} relatórios recentes`} title="Relatórios" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {RELATORIOS.map((r) => (
          <div key={r.id} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, color: COLORS.ink, marginBottom: 3 }}>
                <span style={{ fontWeight: 500 }}>{r.vendedor}</span> · {r.cliente}
              </div>
              <div style={{ fontSize: 13, color: COLORS.inkSoft }}>{r.resumo}</div>
            </div>
            {r.anexo && <Pill color={COLORS.slate} bg={COLORS.slateBg}>Com anexo</Pill>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shell / navegação
// ---------------------------------------------------------------------------
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "equipe", label: "Equipe", icon: Users },
  { key: "agenda", label: "Agenda", icon: CalendarDays },
  { key: "visitas", label: "Visitas", icon: ClipboardList },
  { key: "clientes", label: "Clientes", icon: Building2 },
  { key: "mapa", label: "Mapa", icon: MapIcon },
  { key: "pendencias", label: "Pendências", icon: Clock },
  { key: "excecoes", label: "Exceções", icon: AlertTriangle },
  { key: "indicadores", label: "Indicadores", icon: BarChart3 },
  { key: "relatorios", label: "Relatórios", icon: FileText },
];

export default function PainelGerencial() {
  const [view, setView] = useState("dashboard");

  const VIEW = {
    dashboard: Dashboard,
    equipe: Equipe,
    agenda: Agenda,
    visitas: Visitas,
    clientes: Clientes,
    mapa: Mapa,
    pendencias: Pendencias,
    excecoes: Excecoes,
    indicadores: Indicadores,
    relatorios: Relatorios,
  }[view];

  return (
    <div style={{ display: "flex", minHeight: 720, background: COLORS.bg, fontFamily: FONT_BODY, color: COLORS.ink }}>
      <div style={{ width: 216, background: COLORS.navy, flexShrink: 0, padding: "22px 14px", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 10px 22px", borderBottom: `1px solid ${COLORS.navyLine}`, marginBottom: 14 }}>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 19, fontWeight: 600, color: "#fff" }}>Trilha</div>
          <div style={{ fontSize: 12, color: "#8C9BC2", marginTop: 2 }}>Painel gerencial</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: active ? COLORS.navySoft : "transparent",
                  color: active ? "#fff" : "#AAB4CC",
                  fontFamily: FONT_BODY,
                  fontSize: 13.5,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <Icon size={16} />
                {item.label}
                {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: "auto", padding: "14px 10px 0", borderTop: `1px solid ${COLORS.navyLine}`, fontSize: 11.5, color: "#6E7BA0" }}>
          Protótipo com dados simulados
        </div>
      </div>
      <div style={{ flex: 1, padding: "28px 36px", overflow: "auto" }}>{VIEW && <VIEW />}</div>
    </div>
  );
}
