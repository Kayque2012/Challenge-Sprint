import { API_URL } from '../config';

// ── Base fetch ──────────────────────────────────────────────────────────────

function getToken(): string {
  return sessionStorage.getItem('authToken') ?? '';
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();
  const headers = new Headers({ 'Content-Type': 'application/json', ...options?.headers });
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, (body as { erro?: string }).erro ?? `HTTP ${res.status}`);
  }
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ── Auth ────────────────────────────────────────────────────────────────────

interface LoginResponse {
  nome: string;
  tipo: string;
  id: number;
  cidade?: string;
  token?: string;
}

export const authApi = {
  login: (email: string, senha: string) =>
    request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

  redefinirSenha: (email: string, novaSenha: string) =>
    request<void>('/pacientes/redefinir-senha', {
      method: 'PUT',
      body: JSON.stringify({ email, novaSenha }),
    }),
};

// ── Tipos compartilhados ─────────────────────────────────────────────────────

export interface Paciente {
  id: number;
  nome?: string;
  nomePaciente?: string;
  email: string;
  cidade: string;
  pais: string;
  cpf?: string;
  tipoDor?: string;
  tipo_dor?: string;
  rendaSalarioMinimo?: number;
  renda?: number;
  tempoDorDias?: number;
  tempo_dor?: number;
  scoreMatch?: number;
  score_match?: number;
  idade?: number;
  dataNascimento?: string;
  telefone?: string;
  historico?: HistoricoConsulta[];
  status?: string;
}

export interface Dentista {
  id: number;
  nome?: string;
  nomeDentista?: string;
  email: string;
  cidade: string;
  cro?: string;
}

export interface HistoricoConsulta {
  id?: number;
  titulo?: string;
  status?: string;
  data?: string;
  hora?: string;
  proc?: string;
  dentista?: string;
}

export interface AgendamentoAdmin {
  paciente: string;
  prioridade: string;
  proc: string;
  dentista: string;
  data: string;
  hora: string;
  cidade: string;
}

export interface EstatisticasAdmin {
  total_beneficiarios: number;
  total_dentistas: number;
  por_cidade: Record<string, number>;
  ultimos_agendamentos: AgendamentoAdmin[];
  coordenadas: Record<string, [number, number]>;
}

export interface MensagemContato {
  id?: number;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  criadoEm?: string;
  canal?: string;
  ticket?: string;
}

export interface SlotHorario {
  id?: string;
  data: string;
  hora: string;
}

export interface OfertaAgendamento {
  id?: number;
  dentistaNome: string;
  dentistaCidade?: string;
  dentistaPais?: string;
  procedimento: string;
  slots: SlotHorario[];
  status: 'pendente' | 'confirmado';
  slotEscolhido?: { data: string; hora: string };
  criadaEm: string;
  pacienteNome?: string;
  idPaciente?: number;
  data?: string;
  hora?: string;
}

// ── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  getEstatisticas: () =>
    request<EstatisticasAdmin>('/admin/estatisticas'),

  getPacientes: () =>
    request<Paciente[]>('/pacientes'),

  getDentistas: () =>
    request<Dentista[]>('/dentistas'),

  deletarUsuario: (tipo: 'pacientes' | 'dentistas', id: number) =>
    request<void>(`/${tipo}/${id}`, { method: 'DELETE' }),

  getMensagens: () =>
    request<MensagemContato[]>('/mensagens'),
};

// ── Pacientes ────────────────────────────────────────────────────────────────

export const pacientesApi = {
  get: (id: string | number) =>
    request<Paciente>(`/pacientes/${id}`),

  getHistorico: (id: string | number) =>
    request<HistoricoConsulta[]>(`/pacientes/${id}/historico`),

  getAdotados: (idDentista: string | number) =>
    request<Paciente[]>(`/pacientes/adotados?idDentista=${idDentista}`),

  getPorCidade: (cidade: string) =>
    request<Paciente[]>(`/pacientes?cidade=${encodeURIComponent(cidade)}`),

  update: (id: string | number, payload: Partial<Paciente> & Record<string, unknown>) =>
    request<Paciente>(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

// ── Dentistas ────────────────────────────────────────────────────────────────

export const dentistasApi = {
  redefinirSenha: (email: string, novaSenha: string) =>
    request<void>('/dentistas/redefinir-senha', {
      method: 'PUT',
      body: JSON.stringify({ email, novaSenha }),
    }),
};

// ── Ofertas ─────────────────────────────────────────────────────────────────

interface CriarOfertaPayload {
  idDentista: number;
  idPaciente: number;
  procedimento: string;
  slots: { data: string; hora: string }[];
}

export const ofertasApi = {
  getByPaciente: (idPaciente: string | number) =>
    request<OfertaAgendamento>(`/ofertas/paciente/${idPaciente}`),

  getByDentista: (idDentista: string | number) =>
    request<OfertaAgendamento[]>(`/ofertas/dentista/${idDentista}`),

  create: (payload: CriarOfertaPayload) =>
    request<OfertaAgendamento>('/ofertas', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  confirmar: (id: number, data: string, hora: string) =>
    request<void>(`/ofertas/${id}/confirmar`, {
      method: 'PUT',
      body: JSON.stringify({ data, hora }),
    }),

  concluir: (id: number) =>
    request<void>(`/ofertas/${id}/concluir`, { method: 'PATCH' }),

  delete: (id: number) =>
    request<void>(`/ofertas/${id}`, { method: 'DELETE' }),
};

// ── IA ───────────────────────────────────────────────────────────────────────

interface RespostaIA {
  candidates?: { content: { parts: { text: string }[] } }[];
  resposta?: string;
  error?: string;
}

export const iaApi = {
  consultar: (texto: string, filaJson: string) =>
    request<RespostaIA>('/IA/consultar', {
      method: 'POST',
      body: JSON.stringify({ texto, fila_json: filaJson }),
    }),
};
