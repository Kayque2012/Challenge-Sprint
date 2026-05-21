import { describe, it, expect } from 'vitest';
import {
  calcularRenda,
  calcularScore,
  GRAVIDADE_SCORE,
  IDADE_SCORE,
} from '../utils/scoreUtils';

// ─── calcularRenda ────────────────────────────────────────────────────────────

describe('calcularRenda', () => {
  it('retorna 35 para renda de 0 SM (extrema pobreza)', () => {
    expect(calcularRenda(0)).toBe(35);
  });

  it('retorna 35 para renda de exatamente 0.5 SM', () => {
    expect(calcularRenda(0.5)).toBe(35);
  });

  it('retorna 28 para renda entre 0.5 e 1 SM', () => {
    expect(calcularRenda(0.6)).toBe(28);
    expect(calcularRenda(1)).toBe(28);
  });

  it('retorna 15 para renda entre 1 e 2 SM', () => {
    expect(calcularRenda(1.5)).toBe(15);
    expect(calcularRenda(2)).toBe(15);
  });

  it('retorna 5 para renda acima de 2 SM', () => {
    expect(calcularRenda(2.1)).toBe(5);
    expect(calcularRenda(5)).toBe(5);
    expect(calcularRenda(10)).toBe(5);
  });
});

// ─── GRAVIDADE_SCORE ──────────────────────────────────────────────────────────

describe('GRAVIDADE_SCORE', () => {
  it('leve = 5 pontos', () => expect(GRAVIDADE_SCORE.leve).toBe(5));
  it('moderada = 15 pontos', () => expect(GRAVIDADE_SCORE.moderada).toBe(15));
  it('forte = 30 pontos', () => expect(GRAVIDADE_SCORE.forte).toBe(30));
  it('urgente = 45 pontos (máximo)', () => expect(GRAVIDADE_SCORE.urgente).toBe(45));

  it('pontuação máxima não excede 45', () => {
    const max = Math.max(...Object.values(GRAVIDADE_SCORE));
    expect(max).toBe(45);
  });
});

// ─── IDADE_SCORE ──────────────────────────────────────────────────────────────

describe('IDADE_SCORE', () => {
  it('cobre todas as idades elegíveis de 11 a 17 anos', () => {
    for (let i = 11; i <= 17; i++) {
      expect(IDADE_SCORE[i]).toBeGreaterThan(0);
    }
  });

  it('prioriza jovens mais velhos: 17 > 14 > 11', () => {
    expect(IDADE_SCORE[17]).toBeGreaterThan(IDADE_SCORE[14]);
    expect(IDADE_SCORE[14]).toBeGreaterThan(IDADE_SCORE[11]);
  });

  it('pontuação máxima (idade 17) não excede 20', () => {
    expect(IDADE_SCORE[17]).toBeLessThanOrEqual(20);
  });
});

// ─── calcularScore ────────────────────────────────────────────────────────────

describe('calcularScore', () => {
  it('score máximo = 100 (urgente + renda 0 + idade 17)', () => {
    // 45 + 35 + 20 = 100
    expect(calcularScore('urgente', 0, 17)).toBe(100);
  });

  it('score mínimo para elegível = 13 (leve + renda alta + idade 11)', () => {
    // 5 + 5 + 3 = 13
    expect(calcularScore('leve', 3, 11)).toBe(13);
  });

  it('retorna 0 pontos de idade para fora do range (ex: 20 anos)', () => {
    // 5 + 5 + 0 = 10
    expect(calcularScore('leve', 3, 20)).toBe(10);
  });

  it('score nunca excede 100', () => {
    expect(calcularScore('urgente', 0, 17)).toBeLessThanOrEqual(100);
  });

  it('score cresce com maior gravidade', () => {
    const leve = calcularScore('leve', 1, 14);
    const forte = calcularScore('forte', 1, 14);
    expect(forte).toBeGreaterThan(leve);
  });

  it('score cresce com menor renda', () => {
    const rendaAlta = calcularScore('forte', 3, 14);
    const rendaBaixa = calcularScore('forte', 0.3, 14);
    expect(rendaBaixa).toBeGreaterThan(rendaAlta);
  });
});
