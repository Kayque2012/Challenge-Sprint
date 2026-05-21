/**
 * generateCoordinates.mjs
 *
 * Uso:
 *   npm run coords:update
 *
 * O que faz:
 *   1. Lê src/data/estadosCidades.ts — fonte de verdade de todas as cidades
 *      disponíveis no formulário de cadastro
 *   2. Compara com src/data/latamCoordinates.ts para identificar cidades
 *      que ainda não têm coordenadas
 *   3. Busca coordenadas no OpenStreetMap Nominatim usando cidade + código
 *      ISO do país (ex: q=Aguascalientes&countrycodes=mx) — elimina a
 *      ambiguidade de cidades homónimas em países diferentes
 *   4. Insere as novas entradas em LATAM_COORDINATES e sobrescreve o ficheiro
 *
 * Requer: Node.js 18+ (fetch nativo). Sem dependências extra.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CIDADES_TS  = resolve(__dirname, '../src/data/estadosCidades.ts');
const COORDS_FILE = resolve(__dirname, '../src/data/latamCoordinates.ts');
const NOMINATIM   = 'https://nominatim.openstreetmap.org/search';
const DELAY_MS    = 1100; // respeita o rate limit de 1 req/s do Nominatim

// Nome do país em PT → código ISO 3166-1 alpha-2
// O Nominatim aceita o parâmetro countrycodes com estes códigos,
// garantindo que "Lima" busca Peru e não Lima no Paraguai.
const PAIS_ISO = {
  'Brasil':               'br',
  'Argentina':            'ar',
  'Bolívia':              'bo',
  'Chile':                'cl',
  'Colômbia':             'co',
  'Equador':              'ec',
  'México':               'mx',
  'Panamá':               'pa',
  'Paraguai':             'py',
  'Peru':                 'pe',
  'República Dominicana': 'do',
  'Uruguai':              'uy',
  'Venezuela':            've',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'TurmaDoBeM-CoordScript/1.0 (educational project)',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Lê estadosCidades.ts e devolve pares {cidade, pais}.
 *
 * Estratégia de parsing:
 *   - Identifica blocos de país pelas chaves de nível superior do objeto
 *     DADOS_PAISES (indent de 2 espaços, nome com/sem aspas simples, ": {")
 *   - Dentro de cada bloco, extrai os arrays da seção `cidades:`
 *     no formato  SIGLA: ['Cidade1', 'Cidade2']
 *   - Ignora países não mapeados em PAIS_ISO
 */
function extrairCidadesPorPais(conteudo) {
  const pares = []; // [{cidade, pais}]

  // Localiza as posições de cada país no ficheiro
  const regexPais = /^  (?:'([^']+)'|([\wÀ-ÿ][\wÀ-ÿ\s]*)):\s*\{/gm;
  const posicoesPaises = [];
  let m;
  while ((m = regexPais.exec(conteudo)) !== null) {
    const nome = (m[1] ?? m[2]).trim();
    if (PAIS_ISO[nome]) posicoesPaises.push({ nome, pos: m.index });
  }

  for (let i = 0; i < posicoesPaises.length; i++) {
    const { nome: pais, pos: inicio } = posicoesPaises[i];
    const fim = i + 1 < posicoesPaises.length
      ? posicoesPaises[i + 1].pos
      : conteudo.length;
    const bloco = conteudo.slice(inicio, fim);

    // Localiza a subsecção cidades:
    const idxCidades = bloco.indexOf('cidades:');
    if (idxCidades === -1) continue;
    const blocoCidades = bloco.slice(idxCidades);

    // Extrai arrays: SIGLA: ['Cidade1', 'Cidade2', ...]
    const regexArray = /:\s*\[([^\]]+)\]/g;
    let mArr;
    while ((mArr = regexArray.exec(blocoCidades)) !== null) {
      const regexStr = /'([^']+)'/g;
      let mStr;
      while ((mStr = regexStr.exec(mArr[1])) !== null) {
        pares.push({ cidade: mStr[1], pais });
      }
    }
  }

  return pares;
}

/** Extrai os nomes de cidades já presentes em latamCoordinates.ts */
function lerCidadesExistentes(conteudo) {
  const existentes = new Set();
  const regex = /^\s*'([^']+)':\s*\[/gm;
  let m;
  while ((m = regex.exec(conteudo)) !== null) existentes.add(m[1]);
  return existentes;
}

/** Consulta Nominatim com cidade + countrycodes ISO para precisão máxima */
async function buscarCoordenadas(cidade, paisIso) {
  const params = new URLSearchParams({
    q:               cidade,
    format:          'json',
    limit:           '1',
    countrycodes:    paisIso,
    'accept-language': 'pt',
  });
  const dados = await fetchJson(`${NOMINATIM}?${params}`);
  if (!dados.length) return null;
  return [parseFloat(dados[0].lat), parseFloat(dados[0].lon)];
}

const fmtCoord = ([lat, lon]) => `[${lat.toFixed(4)}, ${lon.toFixed(4)}]`;

/** Insere as novas entradas antes do fechamento do objeto no ficheiro .ts */
function inserirNoFicheiro(conteudo, novasEntradas) {
  if (!novasEntradas.length) return conteudo;
  const linhas = novasEntradas
    .map(([cidade, coords]) => `  '${cidade}': ${fmtCoord(coords)},`)
    .join('\n');
  return conteudo.replace(
    /^(\};)$/m,
    `  // Adicionadas automaticamente por generateCoordinates.mjs\n${linhas}\n$1`,
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📖 A ler estadosCidades.ts...');
  const cidadesConteudo = readFileSync(CIDADES_TS, 'utf-8');
  const coordsConteudo  = readFileSync(COORDS_FILE, 'utf-8');

  // 1. Extrai todos os pares (cidade, país) disponíveis no formulário
  const pares = extrairCidadesPorPais(cidadesConteudo);
  console.log(`📦 ${pares.length} entradas (cidade, país) encontradas no formulário de cadastro.`);

  // 2. Filtra as que já têm coordenadas
  const existentes = lerCidadesExistentes(coordsConteudo);
  const semCoordenadas = pares.filter(({ cidade }) => !existentes.has(cidade));

  // 3. Deduplica por nome de cidade — se a mesma cidade aparece em estados
  //    diferentes do mesmo país, o Nominatim retorna a mais proeminente
  const unicas = new Map(); // cidade → pais (primeiro encontrado)
  for (const { cidade, pais } of semCoordenadas) {
    if (!unicas.has(cidade)) unicas.set(cidade, pais);
  }

  if (!unicas.size) {
    console.log('✅ Todas as cidades do formulário já têm coordenadas. Nada a fazer.');
    return;
  }

  const total = unicas.size;
  const minutos = Math.ceil(total * DELAY_MS / 60_000);
  console.log(`🆕 ${total} cidade(s) sem coordenadas para processar.`);
  console.log(`⏱  Tempo estimado: ~${minutos} minuto(s) (${DELAY_MS}ms por request).\n`);

  // 4. Consulta Nominatim para cada cidade nova
  const novasEntradas = [];
  const semResultado  = [];
  let contador = 0;

  for (const [cidade, pais] of unicas) {
    contador++;
    const iso = PAIS_ISO[pais];
    process.stdout.write(`   [${contador}/${total}] [${pais}] ${cidade}... `);
    try {
      const coords = await buscarCoordenadas(cidade, iso);
      if (coords) {
        console.log(`✓  ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`);
        novasEntradas.push([cidade, coords]);
      } else {
        console.log('⚠  Não encontrado');
        semResultado.push(`'${cidade}' (${pais})`);
      }
    } catch (e) {
      console.log(`✗  Erro: ${e.message}`);
      semResultado.push(`'${cidade}' (${pais})`);
    }
    if (contador < total) await sleep(DELAY_MS);
  }

  // 5. Atualiza latamCoordinates.ts
  if (novasEntradas.length) {
    const novoConteudo = inserirNoFicheiro(coordsConteudo, novasEntradas);
    writeFileSync(COORDS_FILE, novoConteudo, 'utf-8');
    console.log(`\n✅ ${novasEntradas.length} entrada(s) adicionada(s) a latamCoordinates.ts`);
  }

  if (semResultado.length) {
    console.log(`\n⚠  ${semResultado.length} cidade(s) não encontrada(s) no Nominatim.`);
    console.log('   Adicione manualmente se necessário:');
    semResultado.forEach(c => console.log(`   ${c}: [lat, lon],`));
  }

  console.log('\nConcluído.');
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
