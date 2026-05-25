# 🦷 Dentista na Nuvem — Challenge FIAP 2025

![Badge Status](http://img.shields.io/static/v1?label=STATUS&message=CONCLUÍDO&color=FF8C00&style=for-the-badge)
![Badge React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Badge TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Badge TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Badge Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

> Plataforma digital de gestão odontológica desenvolvida para a ONG **Turma do Bem**, conectando jovens em vulnerabilidade social a dentistas voluntários de forma gratuita e humanizada.

---

## 📌 Visão Geral do Projeto

O **Dentista na Nuvem** é a solução tecnológica da equipe para o desafio proposto pela Turma do Bem (TdB) — a maior rede de voluntariado especializado do mundo. A plataforma centraliza solicitações, automatiza o encaminhamento de mensagens e permite o acompanhamento de cada caso por meio de três painéis especializados (Admin, Dentista e Beneficiário).

O sistema utiliza um algoritmo de **"Score TdB"** para priorizar atendimentos por urgência clínica e situação socioeconômica, integração com **Google Gemini** para triagem inteligente, e **mapa de calor** com React Leaflet para conectar pacientes ao dentista voluntário mais próximo.

---

## 🚀 Links do Projeto

- **🌍 Deploy (Vercel):** [challenge-sprint-rose.vercel.app](https://challenge-sprint-rose.vercel.app/)
- **💻 Repositório GitHub:** [github.com/gcorrea4/Challenge-Sprint](https://github.com/gcorrea4/Challenge-Sprint)
- **🎥 Vídeo de Apresentação:** [YouTube](https://youtube.com)

---

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Descrição |
|---|---|---|
| **React** | 18 | Biblioteca principal de UI |
| **TypeScript** | 5 | Tipagem estática |
| **Vite** | 8 (Rolldown) | Build tool / bundler |
| **Tailwind CSS** | v4 | Estilização utility-first (CSS-first config) |
| **React Router DOM** | 7 | Roteamento SPA |
| **React Hook Form** | 7 | Validação de formulários |
| **Framer Motion** | 11 | Animações e transições |
| **React Leaflet** + **Leaflet.heat** | — | Mapas interativos e heatmap |
| **Lucide React** | — | Biblioteca de ícones |
| **Vitest** | — | Testes unitários |

### Backend
| Tecnologia | Descrição |
|---|---|
| **Java / Quarkus** | API REST |
| **Oracle Database** | Persistência de dados |
| **Microsoft Azure** | Hospedagem da API |

### Integrações
| Integração | Uso |
|---|---|
| **Google Gemini API** | IA para triagem inteligente e assistente de chat |
| **Nominatim (OpenStreetMap)** | Geocodificação de cidades para o mapa de calor |
| **Nota Fiscal Paulista** | Direcionamento de créditos ICMS para a TdB |

---

## ✨ Funcionalidades Implementadas

- **Triagem Inteligente** — Algoritmo Score TdB prioriza casos por urgência e renda
- **Match Geográfico** — Heatmap conecta pacientes ao dentista mais próximo
- **3 Painéis de Acesso** — Admin (gestão global + contatos), Dentista (fila + agendamento + IA), Beneficiário (triagem + acompanhamento)
- **Status de Solicitação** — Beneficiário acompanha etapas: triagem → análise → dentista atribuído → consulta confirmada
- **Gestão de Contatos** — Admin visualiza mensagens com status rastreável e roteamento automático por assunto
- **Programas Apolônias do Bem e Dentista do Bem** — Ambos representados na plataforma
- **Chatbot com IA** — Widget de chat integrado ao Gemini na página de contato
- **Prontuário Digital** — Histórico clínico completo
- **Relatórios** — Exportação em PDF e CSV
- **Doação via PIX** — Com calculadora de impacto e Nota Fiscal Paulista
- **Dark Mode** — Tema escuro completo com persistência via localStorage
- **Layout 100% Responsivo** — Mobile, tablet e desktop

---

## 📂 Estrutura de Pastas

```text
Projeto cld front/
├── public/                     # Assets estáticos
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── Header.tsx          # Navbar com dark mode toggle
│   │   ├── Footer.tsx          # Rodapé global
│   │   ├── MapaRota.tsx        # Modal de rota (Leaflet)
│   │   ├── StatusAgendamento.tsx
│   │   ├── ModalAvaliarPaciente.tsx
│   │   ├── ModalFichaAtiva.tsx
│   │   └── ui.tsx              # Skeleton, EmptyState, Badge
│   ├── data/
│   │   └── latamCoordinates.ts # Coordenadas de cidades (gerado por script)
│   ├── hooks/
│   │   └── useDarkMode.ts      # Hook de dark mode (localStorage)
│   ├── img/                    # Imagens estáticas (fotos da equipe, hero)
│   ├── pages/                  # Páginas roteadas
│   │   ├── Home.tsx            # Landing page (com Apolônias do Bem)
│   │   ├── Login.tsx           # Autenticação
│   │   ├── Cadastro.tsx        # Registro de usuários
│   │   ├── Sobre.tsx           # Sobre o projeto
│   │   ├── FAQ.tsx             # Perguntas frequentes
│   │   ├── QuemSomos.tsx       # Equipe de desenvolvimento
│   │   ├── Doador.tsx          # Doação PIX + Nota Fiscal Paulista
│   │   ├── FormularioContato.tsx  # Contato + chatbot IA
│   │   ├── Formulario.tsx      # Formulário de cadastro detalhado
│   │   ├── Prontuario.tsx      # Prontuário digital
│   │   ├── CalculadoraScore.tsx   # Calculadora Score TdB
│   │   ├── AdminDashboard.tsx  # Painel admin (mapa, usuários, contatos)
│   │   ├── DentistaDashboard.tsx  # Painel dentista (fila, agendamento, IA)
│   │   └── PacienteDashboard.tsx  # Painel beneficiário (triagem, histórico)
│   ├── Routes/
│   │   └── index.tsx           # Rotas + ProtectedRoute
│   ├── test/                   # Testes Vitest
│   │   ├── login.test.tsx
│   │   ├── routes.test.ts
│   │   └── scoreUtils.test.ts
│   ├── utils/                  # Utilitários puros
│   │   ├── scoreUtils.ts       # Algoritmo Score TdB
│   │   ├── relatorioUtils.ts   # Geração de relatórios HTML/print
│   │   └── adminExportUtils.ts # Exportação PDF e CSV
│   ├── config.ts               # API_URL (com fallback para Azure)
│   ├── main.tsx                # Entry point
│   └── stl.css                 # Tailwind CSS v4 + variantes dark mode
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json                 # Rewrites para SPA
```

---

## 🚀 Como Rodar o Projeto

**Pré-requisito:** [Node.js 18+](https://nodejs.org/) instalado.

```bash
# 1. Clonar o repositório
git clone https://github.com/gcorrea4/Challenge-Sprint.git
cd "Challenge-Sprint"

# 2. Instalar dependências
npm install

# 3. (Opcional) Configurar API local
# Crie .env.local na raiz:
# VITE_API_URL=http://localhost:8080

# 4. Iniciar servidor de desenvolvimento
npm run dev
# → http://localhost:5173
```

### Scripts disponíveis
```bash
npm run dev           # Servidor de desenvolvimento
npm run build         # Build de produção
npm run typecheck     # Verificação TypeScript
npm run lint          # ESLint
npm run test          # Testes unitários (Vitest)
npm run test:coverage # Relatório de cobertura
npm run check         # Gate pré-commit: TypeScript + ESLint + Testes
```

---

## 📸 Screenshots

![Extra Large Screenshot](public/extra-large-screenshot.png)
![Mobile Screenshot](public/mobile-screenshot.png)

---

## 🏥 Sobre a ONG Turma do Bem

A **Turma do Bem** atua desde 1998 conectando dentistas voluntários a jovens que nunca tiveram acesso a cuidados odontológicos. São dois programas principais:

- **Dentista do Bem** — atendimento gratuito para jovens de 11 a 17 anos em vulnerabilidade social
- **Apolônias do Bem** — cuidado humanizado para mulheres vítimas de violência doméstica

---

## 👥 Equipe de Desenvolvimento (Turma 1TDSPB — FIAP)

| Nome | RM | Papel | GitHub | LinkedIn |
|---|---|---|---|---|
| Gabriel Correa | 567903 | Full Stack Developer | [GitHub](https://github.com/gcorrea4) | [LinkedIn](https://www.linkedin.com/in/gabriel-correa-souza-763135271/) |
| Kayque Duarte | 567980 | Full Stack Developer | [GitHub](https://github.com/Kayque2012) | [LinkedIn](https://www.linkedin.com/in/kayque-duarte-b24313361/) |
| Eric Maciel | 567398 | Full Stack Developer | [GitHub](https://github.com/Eric-devops-tech) | [LinkedIn](https://www.linkedin.com/in/eric-maciel-144058389/) |

---

© 2026 Dentista na Nuvem — Challenge FIAP 2025 · Projeto acadêmico sem fins lucrativos.
