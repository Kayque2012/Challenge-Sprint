// ─── Ticket / identificação ────────────────────────────────────────────────────

/**
 * Gera um número de ticket no formato TDB-AAAA-NNNNN
 * Ex.: id=42 → "TDB-2026-00042"
 * Usado tanto para o número de caso do paciente quanto para tickets de contato.
 */
export function gerarTicket(id: number | string): string {
  const ano = new Date().getFullYear();
  const num = String(id).padStart(5, '0');
  return `TDB-${ano}-${num}`;
}

/**
 * Mascara o CPF para exibição segura (LGPD):
 *   "123.456.789-00" → "***.456.789-**"
 * Aceita CPF formatado ou só dígitos.
 */
export function mascaraCPF(cpf: string): string {
  if (!cpf) return '—';
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return `***.${clean.slice(3, 6)}.${clean.slice(6, 9)}-**`;
}

/**
 * Retorna o label e a classe de cor para o canal de origem.
 * Usado nos cards de contato do AdminDashboard.
 */
export function canalConfig(canal: string): { label: string; cls: string } {
  switch (canal?.toLowerCase()) {
    case 'telegram':
      return { label: 'Telegram', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' };
    case 'whatsapp':
      return { label: 'WhatsApp', cls: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' };
    case 'email':
      return { label: 'E-mail', cls: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300' };
    default:
      return { label: 'Web', cls: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300' };
  }
}
