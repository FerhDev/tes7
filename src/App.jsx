import React, { useState } from "react";
import PainelGerencial from "./PainelGerencial.jsx";
import AppVendedor from "./AppVendedor.jsx";
import VisaoDiretoria from "./VisaoDiretoria.jsx";

const PROTOTIPOS = [
  { key: "gerencial", label: "Painel do gerente", Componente: PainelGerencial },
  { key: "vendedor", label: "App do vendedor", Componente: AppVendedor },
  { key: "diretoria", label: "Visão da diretoria", Componente: VisaoDiretoria },
];

export default function App() {
  const [ativo, setAtivo] = useState("gerencial");
  const atual = PROTOTIPOS.find((p) => p.key === ativo);
  const Componente = atual.Componente;

  return (
    <div style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "14px 20px",
          background: "#0F1728",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            color: "#fff",
            marginRight: 16,
            display: "flex",
            alignItems: "center",
          }}
        >
          Trilha
        </span>
        {PROTOTIPOS.map((p) => (
          <button
            key={p.key}
            onClick={() => setAtivo(p.key)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: ativo === p.key ? "#C1622E" : "transparent",
              color: ativo === p.key ? "#fff" : "#AAB4CC",
              fontSize: 13.5,
              cursor: "pointer",
              fontFamily: '"IBM Plex Sans", sans-serif',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <Componente />
    </div>
  );
}
