import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Clock,
  Camera,
  Check,
  CalendarDays,
  Building2,
  History,
  User,
  Navigation,
  X,
  ChevronRight,
  Wifi,
  BatteryFull,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Tokens (mesma identidade do painel "Trilha", adaptada a toques/telas móveis)
// ---------------------------------------------------------------------------
const C = {
  bg: "#F5F4F0",
  surface: "#FFFFFF",
  ink: "#20242B",
  inkSoft: "#5B6169",
  inkFaint: "#8B9099",
  border: "#E3E0D7",
  navy: "#16213E",
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
const VENDEDOR = { nome: "Marina Costa", regiao: "Zona Sul" };

const AGENDA_INICIAL = [
  {
    id: "v1",
    hora: "08:30",
    cliente: "Mercado Bom Preço",
    endereco: "Rua das Palmeiras, 210 — Vila Mariana",
    contato: "Sr. Aparecido — (11) 98221-3344",
    distanciaKm: 2.4,
    status: "realizada",
    duracaoMin: 28,
    ultimaCompra: "há 12 dias",
  },
  {
    id: "v2",
    hora: "10:15",
    cliente: "Restaurante Sabor Caseiro",
    endereco: "Av. Ibirapuera, 940 — Moema",
    contato: "Dona Célia — (11) 97711-0092",
    distanciaKm: 4.1,
    status: "realizada",
    duracaoMin: 19,
    ultimaCompra: "há 21 dias",
  },
  {
    id: "v3",
    hora: "12:30",
    cliente: "Empório da Vila",
    endereco: "Rua Domingos de Morais, 1580 — Vila Mariana",
    contato: "Sr. Ricardo — (11) 99887-2210",
    distanciaKm: 1.8,
    status: "planejada",
    duracaoMin: null,
    ultimaCompra: "há 8 dias",
  },
  {
    id: "v4",
    hora: "14:00",
    cliente: "Adega Vinho & Cia",
    endereco: "Rua Vergueiro, 3345 — Vila Mariana",
    contato: "Sra. Beatriz — (11) 98456-7712",
    distanciaKm: 3.0,
    status: "planejada",
    duracaoMin: null,
    ultimaCompra: "há 34 dias",
  },
  {
    id: "v5",
    hora: "16:00",
    cliente: "Restaurante Sabor Caseiro — filial",
    endereco: "Rua Pedro de Toledo, 550 — Vila Clementino",
    contato: "Sr. Tadeu — (11) 98213-4432",
    distanciaKm: 5.2,
    status: "planejada",
    duracaoMin: null,
    ultimaCompra: "há 5 dias",
  },
];

const STATUS_LABEL = {
  realizada: { label: "Realizada", color: C.teal, bg: C.tealBg },
  em_andamento: { label: "Em andamento", color: "#3477B0", bg: "#E3EEF7" },
  planejada: { label: "Planejada", color: C.slate, bg: C.slateBg },
  nao_realizada: { label: "Não realizada", color: C.copper, bg: C.copperBg },
};

// ---------------------------------------------------------------------------
// Componentes de apoio
// ---------------------------------------------------------------------------
function Pill({ color, bg, children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11.5,
        fontWeight: 500,
        color,
        background: bg,
        padding: "3px 9px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
      {children}
    </span>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 16px",
        borderBottom: `1px solid ${C.border}`,
        background: C.surface,
        flexShrink: 0,
      }}
    >
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Voltar"
          style={{ border: "none", background: "transparent", padding: 4, cursor: "pointer", display: "flex" }}
        >
          <ChevronLeft size={22} color={C.ink} />
        </button>
      ) : (
        <div style={{ width: 22 }} />
      )}
      <div style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 600, color: C.ink, flex: 1 }}>{title}</div>
      {right}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "13px 16px",
        borderRadius: 10,
        border: "none",
        background: disabled ? C.slateBg : C.copper,
        color: disabled ? C.inkFaint : "#fff",
        fontFamily: FONT_BODY,
        fontSize: 14.5,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "13px 16px",
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        background: C.surface,
        color: C.ink,
        fontFamily: FONT_BODY,
        fontSize: 14.5,
        fontWeight: 500,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function StatusBarMock() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px 4px", fontSize: 12.5, color: C.ink, fontWeight: 500, flexShrink: 0 }}>
      <span>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <Wifi size={13} />
        <BatteryFull size={15} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Telas
// ---------------------------------------------------------------------------
function TelaLogin({ onEntrar }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const entrar = () => {
    if (!usuario.trim() || !senha.trim()) {
      setErro("Informe usuário e senha para continuar.");
      return;
    }
    setErro("");
    onEntrar();
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "60px 24px 32px", background: C.navy }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 26, fontWeight: 600, color: "#fff" }}>Trilha</div>
        <div style={{ fontSize: 13.5, color: "#8C9BC2", marginTop: 4 }}>App do vendedor</div>
      </div>
      <div style={{ background: C.surface, borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12.5, color: C.inkSoft, display: "block", marginBottom: 6 }}>Usuário</label>
          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="marina.costa"
            style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: FONT_BODY, fontSize: 14, boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12.5, color: C.inkSoft, display: "block", marginBottom: 6 }}>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: FONT_BODY, fontSize: 14, boxSizing: "border-box" }}
          />
        </div>
        {erro && <div style={{ fontSize: 12.5, color: C.copper }}>{erro}</div>}
        <PrimaryButton onClick={entrar} style={{ marginTop: 6 }}>Entrar</PrimaryButton>
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: "#6E7BA0", marginTop: 16 }}>Esqueceu a senha? Fale com seu gerente.</div>
    </div>
  );
}

function TelaAgenda({ agenda, onAbrirVisita, onIrPara }) {
  const realizadas = agenda.filter((v) => v.status === "realizada").length;
  const proxima = agenda.find((v) => v.status === "planejada" || v.status === "em_andamento");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "18px 16px 14px", background: C.surface, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 12.5, color: C.inkFaint }}>Olá, {VENDEDOR.nome.split(" ")[0]}</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 20, fontWeight: 600, color: C.ink, marginTop: 2 }}>Agenda de hoje</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <div style={{ flex: 1, background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11.5, color: C.inkFaint }}>Realizadas</div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 600, color: C.teal }}>{realizadas}/{agenda.length}</div>
          </div>
          <div style={{ flex: 1, background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11.5, color: C.inkFaint }}>Próxima parada</div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink, marginTop: 2 }}>{proxima ? proxima.hora : "—"}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "14px 16px 90px" }}>
        {agenda.map((v, i) => {
          const s = STATUS_LABEL[v.status];
          return (
            <button
              key={v.id}
              onClick={() => onAbrirVisita(v.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "13px 14px",
                marginBottom: 10,
                cursor: "pointer",
                fontFamily: FONT_BODY,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ fontSize: 13, color: C.inkFaint, minWidth: 40, paddingTop: 1 }}>{v.hora}</div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 500, color: C.ink }}>{v.cliente}</div>
                    <div style={{ fontSize: 12.5, color: C.inkFaint, marginTop: 2 }}>{v.distanciaKm} km · última compra {v.ultimaCompra}</div>
                  </div>
                </div>
                <ChevronRight size={16} color={C.inkFaint} style={{ flexShrink: 0, marginTop: 2 }} />
              </div>
              <div style={{ marginTop: 8 }}>
                <Pill color={s.color} bg={s.bg}>{s.label}</Pill>
                {v.duracaoMin && <span style={{ fontSize: 12, color: C.inkFaint, marginLeft: 8 }}>{v.duracaoMin} min</span>}
              </div>
            </button>
          );
        })}
      </div>
      <BottomNav active="agenda" onIrPara={onIrPara} />
    </div>
  );
}

function TelaVisita({ visita, onVoltar, onIniciar, onFinalizar }) {
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (visita.status === "em_andamento") {
      timerRef.current = setInterval(() => setTempoDecorrido((t) => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [visita.status]);

  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const s = STATUS_LABEL[visita.status];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar title="Detalhe da visita" onBack={onVoltar} />
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 19, fontWeight: 600, color: C.ink }}>{visita.cliente}</div>
          <div style={{ marginTop: 6 }}>
            <Pill color={s.color} bg={s.bg}>{s.label}</Pill>
          </div>
        </div>

        {visita.status === "em_andamento" && (
          <div style={{ background: C.navy, borderRadius: 12, padding: 18, textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#8C9BC2", marginBottom: 4 }}>Tempo de visita</div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 30, fontWeight: 600, color: "#fff" }}>{mmss(tempoDecorrido)}</div>
          </div>
        )}

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <MapPin size={16} color={C.inkFaint} style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13.5, color: C.ink }}>{visita.endereco}</div>
              <div style={{ fontSize: 12, color: C.inkFaint, marginTop: 2 }}>{visita.distanciaKm} km da sua localização</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Phone size={16} color={C.inkFaint} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 13.5, color: C.ink }}>{visita.contato}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Clock size={16} color={C.inkFaint} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 13.5, color: C.ink }}>Última compra {visita.ultimaCompra}</div>
          </div>
        </div>

        {visita.status === "planejada" && (
          <SecondaryButton onClick={() => {}} style={{ marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Navigation size={15} /> Traçar rota até o cliente
          </SecondaryButton>
        )}
      </div>
      <div style={{ padding: 16, borderTop: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
        {visita.status === "planejada" && <PrimaryButton onClick={onIniciar}>Iniciar visita (check-in)</PrimaryButton>}
        {visita.status === "em_andamento" && <PrimaryButton onClick={onFinalizar}>Finalizar visita</PrimaryButton>}
        {visita.status === "realizada" && <SecondaryButton onClick={onVoltar}>Ver relatório enviado</SecondaryButton>}
      </div>
    </div>
  );
}

function TelaRelatorio({ visita, onEnviar, onVoltar }) {
  const [observacoes, setObservacoes] = useState("");
  const [pendencia, setPendencia] = useState(false);
  const [foto, setFoto] = useState(false);
  const [erro, setErro] = useState("");

  const enviar = () => {
    if (!observacoes.trim()) {
      setErro("Descreva um resumo da visita antes de enviar.");
      return;
    }
    setErro("");
    onEnviar({ observacoes, pendencia, foto });
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar title="Relatório da visita" onBack={onVoltar} />
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        <div style={{ fontSize: 13.5, color: C.inkSoft, marginBottom: 14 }}>{visita.cliente} · check-out registrado</div>

        <label style={{ fontSize: 12.5, color: C.inkSoft, display: "block", marginBottom: 6 }}>Resumo da visita</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Ex.: cliente fez pedido de reposição, sem pendências."
          rows={4}
          style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, fontFamily: FONT_BODY, fontSize: 14, boxSizing: "border-box", resize: "none" }}
        />
        {erro && <div style={{ fontSize: 12.5, color: C.copper, marginTop: 6 }}>{erro}</div>}

        <button
          onClick={() => setFoto((f) => !f)}
          style={{
            marginTop: 14,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 16px",
            borderRadius: 10,
            border: `1px dashed ${foto ? C.teal : C.border}`,
            background: foto ? C.tealBg : C.surface,
            color: foto ? C.teal : C.inkSoft,
            fontFamily: FONT_BODY,
            fontSize: 13.5,
            cursor: "pointer",
          }}
        >
          <Camera size={16} />
          {foto ? "Foto anexada" : "Anexar foto da gôndola/pedido"}
        </button>

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer" }}>
          <button
            onClick={() => setPendencia((p) => !p)}
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              border: `1.5px solid ${pendencia ? C.copper : C.border}`,
              background: pendencia ? C.copper : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {pendencia && <Check size={13} color="#fff" />}
          </button>
          <span style={{ fontSize: 13.5, color: C.ink }}>Abrir pendência para o gerente</span>
        </label>
      </div>
      <div style={{ padding: 16, borderTop: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
        <PrimaryButton onClick={enviar}>Enviar relatório</PrimaryButton>
      </div>
    </div>
  );
}

function TelaConfirmacao({ onVoltarAgenda }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.tealBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
        <Check size={26} color={C.teal} />
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 600, color: C.ink, marginBottom: 6 }}>Relatório enviado</div>
      <div style={{ fontSize: 13.5, color: C.inkSoft, marginBottom: 24 }}>A visita foi registrada e já aparece para o seu gerente.</div>
      <PrimaryButton onClick={onVoltarAgenda}>Voltar para a agenda</PrimaryButton>
    </div>
  );
}

function TelaClientes({ onIrPara }) {
  const clientes = [
    { nome: "Mercado Bom Preço", regiao: "Vila Mariana", ultimaVisita: "há 12 dias" },
    { nome: "Restaurante Sabor Caseiro", regiao: "Moema", ultimaVisita: "há 21 dias" },
    { nome: "Empório da Vila", regiao: "Vila Mariana", ultimaVisita: "há 8 dias" },
    { nome: "Adega Vinho & Cia", regiao: "Vila Mariana", ultimaVisita: "há 34 dias" },
  ];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar title="Meus clientes" />
      <div style={{ flex: 1, overflow: "auto", padding: 16, paddingBottom: 90 }}>
        {clientes.map((c) => (
          <div key={c.nome} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{c.nome}</div>
            <div style={{ fontSize: 12.5, color: C.inkFaint, marginTop: 2 }}>{c.regiao} · última visita {c.ultimaVisita}</div>
          </div>
        ))}
      </div>
      <BottomNav active="clientes" onIrPara={onIrPara} />
    </div>
  );
}

function TelaHistorico({ agenda, onIrPara }) {
  const feitas = agenda.filter((v) => v.status === "realizada");
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar title="Histórico de hoje" />
      <div style={{ flex: 1, overflow: "auto", padding: 16, paddingBottom: 90 }}>
        {feitas.length === 0 && <div style={{ fontSize: 13.5, color: C.inkFaint, textAlign: "center", marginTop: 40 }}>Nenhuma visita concluída ainda.</div>}
        {feitas.map((v) => (
          <div key={v.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{v.cliente}</div>
              <div style={{ fontSize: 12.5, color: C.inkFaint }}>{v.hora}</div>
            </div>
            <div style={{ fontSize: 12.5, color: C.inkFaint, marginTop: 2 }}>{v.duracaoMin} min de atendimento</div>
          </div>
        ))}
      </div>
      <BottomNav active="historico" onIrPara={onIrPara} />
    </div>
  );
}

function TelaPerfil({ onSair, onIrPara }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar title="Perfil" />
      <div style={{ flex: 1, overflow: "auto", padding: 16, paddingBottom: 90 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.copperBg, color: C.copper, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontFamily: FONT_HEAD }}>
            MC
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: C.ink }}>{VENDEDOR.nome}</div>
            <div style={{ fontSize: 12.5, color: C.inkFaint }}>{VENDEDOR.regiao}</div>
          </div>
        </div>
        <SecondaryButton onClick={onSair}>Sair</SecondaryButton>
      </div>
      <BottomNav active="perfil" onIrPara={onIrPara} />
    </div>
  );
}

function BottomNav({ active, onIrPara }) {
  const items = [
    { key: "agenda", label: "Agenda", icon: CalendarDays },
    { key: "clientes", label: "Clientes", icon: Building2 },
    { key: "historico", label: "Histórico", icon: History },
    { key: "perfil", label: "Perfil", icon: User },
  ];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", background: C.surface, borderTop: `1px solid ${C.border}`, padding: "8px 4px 12px" }}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onIrPara(item.key)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: isActive ? C.copper : C.inkFaint,
              fontFamily: FONT_BODY,
            }}
          >
            <Icon size={19} />
            <span style={{ fontSize: 10.5 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// App raiz
// ---------------------------------------------------------------------------
export default function AppVendedor() {
  const [logado, setLogado] = useState(false);
  const [tela, setTela] = useState("agenda"); // agenda | visita | relatorio | confirmacao | clientes | historico | perfil
  const [agenda, setAgenda] = useState(AGENDA_INICIAL);
  const [visitaAtivaId, setVisitaAtivaId] = useState(null);

  const visitaAtiva = agenda.find((v) => v.id === visitaAtivaId);

  const abrirVisita = (id) => {
    setVisitaAtivaId(id);
    setTela("visita");
  };

  const iniciarVisita = () => {
    setAgenda((prev) => prev.map((v) => (v.id === visitaAtivaId ? { ...v, status: "em_andamento" } : v)));
  };

  const finalizarVisita = () => {
    setTela("relatorio");
  };

  const enviarRelatorio = () => {
    setAgenda((prev) => prev.map((v) => (v.id === visitaAtivaId ? { ...v, status: "realizada", duracaoMin: v.duracaoMin || 24 } : v)));
    setTela("confirmacao");
  };

  let conteudo;
  if (!logado) {
    conteudo = <TelaLogin onEntrar={() => setLogado(true)} />;
  } else if (tela === "agenda") {
    conteudo = <TelaAgenda agenda={agenda} onAbrirVisita={abrirVisita} onIrPara={setTela} />;
  } else if (tela === "visita") {
    conteudo = <TelaVisita visita={visitaAtiva} onVoltar={() => setTela("agenda")} onIniciar={iniciarVisita} onFinalizar={finalizarVisita} />;
  } else if (tela === "relatorio") {
    conteudo = <TelaRelatorio visita={visitaAtiva} onEnviar={enviarRelatorio} onVoltar={() => setTela("visita")} />;
  } else if (tela === "confirmacao") {
    conteudo = <TelaConfirmacao onVoltarAgenda={() => setTela("agenda")} />;
  } else if (tela === "clientes") {
    conteudo = <TelaClientes onIrPara={setTela} />;
  } else if (tela === "historico") {
    conteudo = <TelaHistorico agenda={agenda} onIrPara={setTela} />;
  } else if (tela === "perfil") {
    conteudo = <TelaPerfil onSair={() => setLogado(false)} onIrPara={setTela} />;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px 0", background: C.bg, minHeight: 780 }}>
      <div
        style={{
          width: 390,
          height: 780,
          background: C.surface,
          borderRadius: 36,
          border: "8px solid #16181C",
          boxShadow: "0 0 0 1px #16181C",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: FONT_BODY,
        }}
      >
        <StatusBarMock />
        {conteudo}
      </div>
    </div>
  );
}
