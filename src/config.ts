/**
 * URL base da API \u2014 resolvida em tempo de build pelo Vite.
 *
 * Produ\u00E7\u00E3o (vite build / Vercel):
 *   Sempre aponta para o Azure correto, independente de qualquer
 *   vari\u00E1vel de ambiente que possa estar configurada no projeto Vercel.
 *
 * Desenvolvimento local:
 *   Crie um arquivo Challenge-Sprint/.env.local com:
 *     VITE_API_URL=http://localhost:8080
 *   Em modo dev (import.meta.env.DEV === true) a vari\u00E1vel \u00E9 respeitada,
 *   permitindo apontar para o backend local.
 *   O arquivo .env.local j\u00E1 est\u00E1 no .gitignore via padr\u00E3o *.local.
 *
 * .replace(/^\uFEFF/, '') \u2192 remove BOM (Byte Order Mark) que editores
 * Windows \u00E0s vezes inserem no in\u00EDcio de arquivos .env, evitando erros
 * silenciosos de URL como "\uFEFFhttps://..." que o fetch n\u00E3o reconhece.
 */
const PRODUCTION_API = 'https://challengesprint-api.azurewebsites.net';

export const API_URL = import.meta.env.DEV && import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/^\uFEFF/, '').trim()
  : PRODUCTION_API;
