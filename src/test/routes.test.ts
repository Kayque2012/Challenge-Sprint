/**
 * Testa a configuração de rotas lendo o arquivo Routes/index.tsx diretamente.
 * Detecta typos (ex: Calculadura vs Calculadora) e rotas faltando.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
let routesContent = '';

beforeAll(() => {
  routesContent = readFileSync(resolve(__dir, '../Routes/index.tsx'), 'utf-8');
});

describe('Routes/index.tsx — typos', () => {
  it('rota da calculadora está escrita corretamente: /Calculadora/Score', () => {
    expect(routesContent).toContain('/Calculadora/Score');
  });

  it('typo "/Calculadura/Score" não existe mais no arquivo', () => {
    expect(routesContent).not.toContain('/Calculadura/Score');
  });
});

describe('Routes/index.tsx — rotas essenciais presentes', () => {
  const rotasEssenciais = [
    '/',
    '/login',
    '/cadastro',
    '/dashboard/admin',
    '/dashboard/dentista',
    '/dashboard/paciente',
    '/Calculadora/Score',
    '/prontuario/:nome',
  ];

  rotasEssenciais.forEach((rota) => {
    it(`rota "${rota}" está definida`, () => {
      // Aceita aspas duplas OU simples (o arquivo usa os dois estilos)
      const comAspasDuplas = routesContent.includes(`path="${rota}"`);
      const comAspasSimples = routesContent.includes(`path='${rota}'`);
      expect(comAspasDuplas || comAspasSimples).toBe(true);
    });
  });
});

describe('Routes/index.tsx — imports', () => {
  it('importa todos os componentes de dashboard', () => {
    expect(routesContent).toContain('AdminDashboard');
    expect(routesContent).toContain('DentistaDashboard');
    expect(routesContent).toContain('PacienteDashboard');
  });

  it('importa CalculadoraScore', () => {
    expect(routesContent).toContain('CalculadoraScore');
  });
});
