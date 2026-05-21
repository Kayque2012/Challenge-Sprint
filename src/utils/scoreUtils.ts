/**
 * Lógica de cálculo de score do programa Turma do Bem.
 * Extraída para ser reutilizável e testável independentemente do componente.
 */

export type TipoDor = 'leve' | 'moderada' | 'forte' | 'urgente';

/** Pontos por gravidade da dor (máx 45) */
export const GRAVIDADE_SCORE: Record<TipoDor, number> = {
  leve: 5,
  moderada: 15,
  forte: 30,
  urgente: 45,
};

/** Pontos por idade (11–17 anos, máx 20) */
export const IDADE_SCORE: Record<number, number> = {
  17: 20,
  16: 17,
  15: 14,
  14: 11,
  13: 8,
  12: 5,
  11: 3,
};

/** Pontos por renda familiar em salários mínimos (máx 35) */
export function calcularRenda(renda: number): number {
  if (renda <= 0.5) return 35;
  if (renda <= 1) return 28;
  if (renda <= 2) return 15;
  return 5;
}

/** Score total de prioridade (0–100) */
export function calcularScore(tipoDor: TipoDor, renda: number, idade: number): number {
  const gravidade = GRAVIDADE_SCORE[tipoDor];
  const financeiro = calcularRenda(renda);
  const idadePts = IDADE_SCORE[idade] ?? 0;
  return gravidade + financeiro + idadePts;
}
