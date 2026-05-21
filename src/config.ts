/**
 * URL base da API \u2014 resolvida em tempo de build pelo Vite.
 *
 * Produ\u00E7\u00E3o / Vercel:
 *   Usa VITE_API_URL do arquivo .env \u2192 aponta para o Azure.
 *
 * Desenvolvimento local:
 *   Crie um arquivo Challenge-Sprint/.env.local com:
 *     VITE_API_URL=http://localhost:8080
 *   O Vite carrega .env.local com prioridade sobre .env,
 *   e o arquivo j\u00E1 est\u00E1 no .gitignore via padr\u00E3o *.local.
 *
 * .replace(/^\uFEFF/, '') \u2192 remove BOM (Byte Order Mark) que editores
 * Windows \u00E0s vezes inserem no in\u00EDcio de arquivos .env, evitando erros
 * silenciosos de URL como "\uFEFFhttps://..." que o fetch n\u00E3o reconhece.
 */
export const API_URL = (import.meta.env.VITE_API_URL || 'https://challengesprint-api.azurewebsites.net')
  .replace(/^\uFEFF/, '') // remove BOM do Windows
  .trim();
