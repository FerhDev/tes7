import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  TrendingUp,
  Layers,
  Trophy,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

// ---------------------------------------------------------------------------
// Tokens (identidade "Trilha")
// ---------------------------------------------------------------------------
const C = {
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
const TENDENCIA_MENSAL = [
  { mes: "Abr", aderencia: 78, cobertura: 71 },
  { mes: "Mai", aderencia: 80, cobertura: 73 },
  { mes: "Jun", aderencia: 76, cobertura: 70 },
  { mes: "Jul", aderencia: 82, cobertura: 74 },
  { mes: "Ago", aderencia: 85, cobertura: 76 },
  { mes: "Set", aderencia: 83, cobertura: 78 },
];

const REGIONAIS = [
  { id: "reg1", nome: "Zona Sul", gerente: "Ana Beatriz Ferreira", equipe: 9, aderencia: 88, cobertura: 82, tendencia: "alta" },
  { id: "reg2", nome: "Zona Norte", gerente: "Marcelo Prado", equipe: 7, aderencia: 79, cobertura: 74, tendencia: "estavel" },
  { id: "reg3", nome: "Grande ABC", gerente: "Sandra Lima", equipe: 6, aderencia: 61, cobertura: 58, tendencia: "baixa" },
  { id: "reg4", nome: "Zona Leste", gerente: "Otávio Ribeiro", equipe: 8, aderencia: 84, cobertura: 77, tendencia: "alta" },
  { id: "reg5", nome: "Litoral", gerente: "Patrícia Nunes", equipe: 5, aderencia: 91, cobertura: 85, tendencia: "alta" },
  { id: "reg6", nome: "Interior", gerente: "Rodrigo Alves", equipe: 10, aderencia: 74, cobertura: 68, tendencia: "estavel" },
];

const TENDENCIA_ICON = {
  alta: { icon: ArrowUpRight, color: C.teal },
  baixa: { icon: ArrowDownRight, color: C.copper },
  estavel: { icon: Minus, color: C.slate },
};

const RANKING_TOP = [
  { nome: "Juliana Prado", regional: "Litoral", aderencia: 96 },
  { nome: "Patrícia Nunes Jr.", regional: "Litoral", aderencia: 94 },
  { nome: "Marina Costa", regional: "Zona Sul", aderencia: 93 },
  { nome: "Camila Duarte", regional: "Zona Leste", aderencia: 91 },
  { nome: "Larissa Meireles", regional: "Interior", aderencia: 90 },
];

const RANKING_BOTTOM = [
  { nome: "Bruno Tavares", regional: "Grande ABC", aderencia: 42 },
  { nome: "Felipe Nogueira", regional: "Zona Oeste", aderencia: 51 },
  { nome: "Diego Ramos", regional: "Interior", aderencia: 58 },
  { nome: "Heitor Salgado", regional: "Grande ABC", aderencia: 60 },
  { nome: "Renata Campos", regional: "Zona Norte", aderencia: 63 },
];

const ALERTAS = [
  {
    id: "a1",
    titulo: "Grande ABC com aderência abaixo de 65% por 2 meses seguidos",
    detalhe: "Equipe de Sandra Lima está consistentemente abaixo da meta corporativa (75%).",
    severidade: "alta",
  },
  {
    id: "a2",
    titulo: "12 clientes estratégicos sem visita há mais de 60 dias",
    detalhe: "Concentrados principalmente em Grande ABC e Zona Oeste.",
    severidade: "alta",
  },
  {
    id: "a3",
    titulo: "Taxa de exceções (rotas e check-outs) subiu 18% no mês",
    detalhe: "Maior parte concentrada em 3 vendedores de Grande ABC e Interior.",
    severidade: "media",
  },
  {
    id: "a4",
    titulo: "Zona Norte estagnada há 3 meses",
    detalhe: "Aderência sem variação relevante — oportunidade de revisão de rotas.",
    severidade: "baixa",
  },
];

const SEVERIDADE = {
  alta: { color: C.copper, bg: C.copperBg, label: "Alta" },
  media: { color: C.amber, bg: C.amberBg, label: "Média" },
  baixa: { color: C.slate, bg: C.slateBg, label: "Baixa" },
};

// ---------------------------------------------------------------------------
// Componentes de apoio
// ---------------------------------------------------------------------------
function KpiCard({ label, value, delta, deltaTipo }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", flex: 1, minWidth: 190 }}>
      <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 32, fontWeight: 600, color: C.ink, lineHeight: 1 }}>{value}</div>
        {delta && (
          <span style={{ fontSize: 12.5, fontWeight: 500, color: deltaTipo === "alta" ? C.teal : deltaTipo === "baixa" ? C.copper : C.inkFaint, display: "flex", alignItems: "center", gap: 2 }}>
            {deltaTipo === "alta" && <ArrowUpRight size={13} />}
            {deltaTipo === "baixa" && <ArrowDownRight size={13} />}
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

function Pill({ color, bg, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color, background: bg, padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      {children}
    </span>
  );
}

function BarraProgresso(valor, cor) {
  return (
    <div style={{ height: 5, borderRadius: 3, background: C.slateBg, overflow: "hidden", width: 90 }}>
      <div style={{ height: "100%", width: `${valor}%`, background: cor }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Seções
// ---------------------------------------------------------------------------
function Resumo() {
  const mediaAderencia = Math.round(REGIONAIS.reduce((a, r) => a + r.aderencia, 0) / REGIONAIS.length);
  const mediaCobertura = Math.round(REGIONAIS.reduce((a, r) => a + r.cobertura, 0) / REGIONAIS.length);
  const equipeTotal = REGIONAIS.reduce((a, r) => a + r.equipe, 0);
  const alertasAltos = ALERTAS.filter((a) => a.severidade === "alta").length;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        <KpiCard label="Aderência à agenda (rede)" value={`${mediaAderencia}%`} delta="+3 p.p. vs. mês anterior" deltaTipo="alta" />
        <KpiCard label="Cobertura da carteira" value={`${mediaCobertura}%`} delta="+2 p.p. vs. mês anterior" deltaTipo="alta" />
        <KpiCard label="Vendedores em campo" value={equipeTotal} delta="6 regionais" deltaTipo="estavel" />
        <KpiCard label="Alertas de alta severidade" value={alertasAltos} delta="requer atenção" deltaTipo="baixa" />
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <TrendingUp size={16} color={C.inkSoft} />
          <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>Tendência dos últimos 6 meses</div>
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={TENDENCIA_MENSAL}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: C.inkFaint }} axisLine={{ stroke: C.border }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: C.inkFaint }} axisLine={false} tickLine={false} width={36} unit="%" domain={[50, 100]} />
            <Tooltip contentStyle={{ fontSize: 12.5, borderRadius: 8, border: `1px solid ${C.border}` }} formatter={(v) => `${v}%`} />
            <Legend wrapperStyle={{ fontSize: 12.5 }} />
            <Line type="monotone" dataKey="aderencia" name="Aderência à agenda" stroke={C.navy} strokeWidth={2.2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="cobertura" name="Cobertura da carteira" stroke={C.teal} strokeWidth={2.2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <AlertTriangle size={16} color={C.inkSoft} />
        <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>Alertas que exigem atenção</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ALERTAS.slice(0, 2).map((a) => (
          <div key={a.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{a.titulo}</div>
                <div style={{ fontSize: 12.5, color: C.inkFaint, marginTop: 3 }}>{a.detalhe}</div>
              </div>
              <Pill color={SEVERIDADE[a.severidade].color} bg={SEVERIDADE[a.severidade].bg}>{SEVERIDADE[a.severidade].label}</Pill>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Regionais() {
  return (
    <div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 12, color: C.ink }}>Aderência à agenda por regional</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={REGIONAIS} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: C.inkFaint }} axisLine={false} tickLine={false} unit="%" />
            <YAxis type="category" dataKey="nome" tick={{ fontSize: 12, fill: C.inkSoft }} axisLine={false} tickLine={false} width={90} />
            <Tooltip contentStyle={{ fontSize: 12.5, borderRadius: 8, border: `1px solid ${C.border}` }} formatter={(v) => `${v}%`} />
            <Bar dataKey="aderencia" radius={[0, 4, 4, 0]}>
              {REGIONAIS.map((r, i) => (
                <Cell key={i} fill={r.aderencia >= 80 ? C.teal : r.aderencia >= 65 ? C.amber : C.copper} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "#FAFAF7" }}>
              {["Regional", "Gerente", "Equipe", "Aderência", "Cobertura", "Tendência"].map((h) => (
                <th key={h} style={{ textAlign: h === "Equipe" ? "center" : "left", padding: "10px 16px", color: C.inkFaint, fontWeight: 500, fontSize: 12.5, borderBottom: `1px solid ${C.border}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REGIONAIS.map((r, i) => {
              const Trend = TENDENCIA_ICON[r.tendencia];
              return (
                <tr key={r.id} style={{ borderBottom: i < REGIONAIS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500, color: C.ink }}>{r.nome}</td>
                  <td style={{ padding: "12px 16px", color: C.inkSoft }}>{r.gerente}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center", color: C.ink }}>{r.equipe}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: C.ink, minWidth: 30 }}>{r.aderencia}%</span>
                      {BarraProgresso(r.aderencia, r.aderencia >= 80 ? C.teal : r.aderencia >= 65 ? C.amber : C.copper)}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: C.ink }}>{r.cobertura}%</td>
                  <td style={{ padding: "12px 16px" }}>
                    <Trend.icon size={16} color={Trend.color} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Ranking() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Trophy size={16} color={C.teal} />
            <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>Top 5 — maior aderência</div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            {RANKING_TOP.map((v, i) => (
              <div key={v.nome} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < RANKING_TOP.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontFamily: FONT_HEAD, fontSize: 13, color: C.inkFaint, width: 16 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: C.ink, fontWeight: 500 }}>{v.nome}</div>
                  <div style={{ fontSize: 12, color: C.inkFaint }}>{v.regional}</div>
                </div>
                <div style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 600, color: C.teal }}>{v.aderencia}%</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={16} color={C.copper} />
            <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>5 vendedores que precisam de suporte</div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            {RANKING_BOTTOM.map((v, i) => (
              <div key={v.nome} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < RANKING_BOTTOM.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontFamily: FONT_HEAD, fontSize: 13, color: C.inkFaint, width: 16 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: C.ink, fontWeight: 500 }}>{v.nome}</div>
                  <div style={{ fontSize: 12, color: C.inkFaint }}>{v.regional}</div>
                </div>
                <div style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 600, color: C.copper }}>{v.aderencia}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Alertas() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {ALERTAS.map((a) => (
        <div key={a.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 6 }}>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: C.ink }}>{a.titulo}</div>
            <Pill color={SEVERIDADE[a.severidade].color} bg={SEVERIDADE[a.severidade].bg}>{SEVERIDADE[a.severidade].label}</Pill>
          </div>
          <div style={{ fontSize: 13, color: C.inkSoft }}>{a.detalhe}</div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------
const ABAS = [
  { key: "resumo", label: "Resumo executivo" },
  { key: "regionais", label: "Comparativo entre regionais" },
  { key: "ranking", label: "Ranking" },
  { key: "alertas", label: "Alertas" },
];

export default function VisaoDiretoria() {
  const [aba, setAba] = useState("resumo");
  const VIEW = { resumo: Resumo, regionais: Regionais, ranking: Ranking, alertas: Alertas }[aba];

  return (
    <div style={{ background: C.bg, minHeight: 720, fontFamily: FONT_BODY, color: C.ink }}>
      <div style={{ background: C.navy, padding: "22px 36px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 13, color: "#8C9BC2" }}>Trilha · visão executiva</div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 600, color: "#fff", marginTop: 2 }}>Rede de vendas externas</div>
          </div>
          <div style={{ fontSize: 12.5, color: "#8C9BC2" }}>Setembro de 2026 · 6 regionais</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {ABAS.map((item) => {
            const active = aba === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setAba(item.key)}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  background: "transparent",
                  color: active ? "#fff" : "#8C9BC2",
                  borderBottom: active ? `2px solid ${C.copper}` : "2px solid transparent",
                  fontFamily: FONT_BODY,
                  fontSize: 13.5,
                  fontWeight: active ? 500 : 400,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "28px 36px 40px" }}>{VIEW && <VIEW />}</div>
    </div>
  );
}
