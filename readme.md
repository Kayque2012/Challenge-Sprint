# 🦷 Turma do Bem - Otimizando o Atendimento, Transformando Vidas

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=CONCLUÍDO&color=FF8C00&style=for-the-badge)
![Badge React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Badge TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Badge TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📌 Visão Geral do Projeto

A Turma do Bem (TdB) é a maior rede de voluntariado odontológico do mundo. Nosso projeto visa solucionar os gargalos na triagem e distribuição de pacientes através de uma plataforma web integrada. O sistema conecta jovens em vulnerabilidade social a dentistas voluntários, utilizando um algoritmo de "Score TdB" para priorizar os casos mais graves e otimizar o fluxo de atendimento.

---

## 📌 Nota sobre a Sprint 3 (Simulação Local)

> ⚠️ **Atenção Avaliador:** Para atender estritamente às regras da **Sprint 3**, esta aplicação **não consome APIs externas (sem fetch/axios)**.
> Todo o fluxo de dados (Cadastro, Login, Triagem e Dashboard) está sendo simulado utilizando o `localStorage` e o estado local do React para fins de demonstração da interface (SPA) e das lógicas de componentização. A integração real com o Back-End (Python) será habilitada na Sprint 4.

---

## 🚀 Links do Projeto (Sprint 4)

- **🌍 Deploy na Vercel (Aplicação Online):** [https://challenge-sprint-rose.vercel.app/]
- **🎥 Vídeo de Apresentação (YouTube):** [link_a_ser_colocado]
- **💻 Repositório GitHub:** [https://github.com/gcorrea4/Challenge-Sprint]

---

## 🛠️ Tecnologias Utilizadas

A aplicação foi desenvolvida seguindo os princípios de uma Single Page Application (SPA), garantindo performance, tipagem rigorosa e alta responsividade.

- **Front-end:** React.js com Vite — Alta performance e build ultrarrápido.
- **Linguagem:** TypeScript — Tipagem estática e segurança no código.
- **Estilização:** Tailwind CSS — Estilização moderna e responsividade total sem CSS externo.
- **Navegação:** React Router DOM — Navegação SPA (Single Page Application) fluida.
- **Formulários e Validação:** React Hook Form — Validação avançada e nativa de formulários.
- **Ícones:** Lucide React
- **Integração:** Fetch API Nativa (comunicando com API Java/DDD)
- **Deploy:** Vercel

---

## ✨ Funcionalidades Implementadas

- **Layout 100% Responsivo:** Adaptado perfeitamente para Mobile, Tablet e Desktop.
- **Navegação SPA:** Transição entre páginas sem recarregamento.
- **Simulação de Match e Dashboard:** O painel do Dentista exibe uma fila dinâmica (mockada) para demonstrar a geolocalização.
- **Painéis Exclusivos:** Visão gerencial e gamificada para Dentistas, e interface de impacto para Pacientes.
- **Sistema de Login Local:** Níveis de acesso e validação de sessão usando `sessionStorage` e `localStorage`.

---

## 📂 Estrutura de Pastas

A arquitetura do projeto foi dividida de forma modular para facilitar a manutenção e a escalabilidade dos componentes.

```text
CHALLENGE-SPRINT/
├── public/                 # Imagens estáticas principais e assets globais
├── src/                    # Código fonte da aplicação
│   ├── components/         # Componentes reutilizáveis (Header, Footer, Cards)
│   ├── img/                # Ícones e imagens vetoriais do sistema
│   ├── pages/              # Páginas e Dashboards (Views do React Router)
│   ├── App.tsx             # Configuração de Rotas Dinâmicas e Estáticas
│   ├── main.tsx            # Ponto de entrada do React
│   └── stl.css             # Diretivas do Tailwind CSS
├── .gitignore              # Arquivos ignorados pelo Git
├── eslint.config.js        # Regras de linting do projeto
├── index.html              # Template base da SPA
├── package.json            # Dependências e scripts do projeto
├── tailwind.config.js      # Configurações do tema e cores do Tailwind
└── tsconfig.json           # Configurações do compilador TypeScript
```

---

## 🚀 Como Rodar o Projeto

Este projeto utiliza o **Vite** como ferramenta de build. Não é necessário ter o Vite instalado previamente de forma global; o comando de instalação abaixo baixará tudo o que é necessário.

**Pré-requisito:** Certifique-se de ter o [Node.js](https://nodejs.org/) instalado no seu computador.

1. Faça o clone do repositório ou extraia o arquivo `.zip` fornecido.
2. Abra a pasta do projeto no seu editor de código (ex: VS Code).
3. Abra um novo terminal na pasta raiz do projeto e instale todas as dependências:

```bash
npm install
```

4. Após o término da instalação, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. O terminal exibirá um link local (geralmente `http://localhost:5173/`). Segure o `Ctrl` e clique no link para abrir a aplicação no seu navegador.

---


## 📸 Screenshots

![Extra Large Screenshot](public\extra-large-screenshot.png)
![Mobile Screenshot](public\mobile-screenshot.png)

---

## 👥 Equipe de Desenvolvimento (Turma 1TDSPB)

| Nome | RM | GitHub | LinkedIn |
|---|---|---|---|
| Gabriel Correa | 567903 | [GitHub](https://github.com/gcorrea4) | [LinkedIn](https://www.linkedin.com/in/gabriel-correa-souza-763135271/) |
| Kayque Duarte | 567980 | [GitHub](https://github.com/Kayque2012) | [LinkedIn](https://www.linkedin.com/in/kayque-duarte-b24313361/) |
| Eric Maciel | 567398 | [GitHub](https://github.com/Eric-devops-tech) | [LinkedIn](https://www.linkedin.com/in/eric-maciel-144058389/) |
