# Trilha — Protótipos

Protótipos funcionais do sistema de vendas externas:

- `src/PainelGerencial.jsx` — painel do gerente (web)
- `src/AppVendedor.jsx` — app do vendedor (mobile)
- `src/VisaoDiretoria.jsx` — visão executiva da diretoria

## Publicação automática

Este repositório já vem com um workflow (`.github/workflows/deploy.yml`) que builda e
publica o site no GitHub Pages sempre que houver um push na branch `main`.

Depois de subir os arquivos, vá em **Settings → Pages** e, em **Source**, selecione
**GitHub Actions**. O link do site aparecerá ali mesmo assim que a publicação terminar
(acompanhe o progresso na aba **Actions** do repositório).

## Editando depois

Para alterar qualquer tela, edite o arquivo `.jsx` correspondente na pasta `src/` direto
pelo site do GitHub (ícone de lápis) e faça o commit — a publicação é refeita automaticamente.
