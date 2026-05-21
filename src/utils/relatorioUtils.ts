interface PacienteRelatorio {
  nome: string;
  idade: number;
  cidade: string;
  pais: string;
  tipo_dor: string;
  renda: number;
  tempo_dor: number;
  historico?: Array<{
    status?: string;
    data?: string;
    hora?: string;
    proc?: string;
    titulo?: string;
    dentista?: string;
  }>;
}

export function buildRelatorioHtml(paciente: PacienteRelatorio, dentista: string): string {
  const historico = paciente.historico || [];
  const concluidas = historico.filter(h => h.status !== 'Agendado').length;
  const agendadasCount = historico.filter(h => h.status === 'Agendado').length;
  const dataEmissao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const itensHistorico = historico.length === 0
    ? '<p class="empty">Nenhuma consulta registrada.</p>'
    : historico.map(h => `
      <div class="item ${h.status !== 'Agendado' ? 'done' : ''}">
        <span class="item-title">${h.proc || h.titulo || 'Procedimento'}</span>
        <span class="badge ${h.status === 'Agendado' ? 'ag' : 'ok'}">${h.status}</span>
        <div class="item-meta">📅 ${h.data || '—'}${h.hora ? ' &nbsp;·&nbsp; ⏰ ' + h.hora : ''} &nbsp;·&nbsp; 👨‍⚕️ Dr(a). ${h.dentista || dentista}</div>
      </div>`).join('');

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
  <title>Relatório — ${paciente.nome}</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;color:#333;max-width:800px;margin:0 auto}
    h1{color:#FF8C00;border-bottom:3px solid #FF8C00;padding-bottom:12px;margin-bottom:4px}
    .sub{color:#888;font-size:13px;margin-bottom:24px}
    h2{color:#555;font-size:15px;text-transform:uppercase;letter-spacing:1px;margin-top:28px;margin-bottom:10px;border-left:4px solid #FF8C00;padding-left:10px}
    .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:8px}
    .card{background:#f9f9f9;border-radius:8px;padding:12px;border:1px solid #eee}
    .card-label{font-size:10px;text-transform:uppercase;color:#aaa;font-weight:bold;display:block;margin-bottom:4px}
    .card-val{font-size:16px;font-weight:bold;color:#333}
    .stats{display:flex;gap:32px;margin:16px 0;background:#fff8f0;padding:20px;border-radius:12px;border:1px solid #ffe0b2}
    .stat{text-align:center}
    .stat-n{font-size:36px;font-weight:900;color:#FF8C00}
    .stat-n.green{color:#8dc63f}
    .stat-n.orange{color:#e67e22}
    .stat-l{font-size:11px;color:#888;margin-top:4px}
    .item{border-left:4px solid #FF8C00;padding:12px 16px;margin:8px 0;background:#fff8f0;border-radius:0 8px 8px 0}
    .item.done{border-color:#8dc63f;background:#f0fff4}
    .item-title{font-weight:bold;font-size:14px}
    .badge{display:inline-block;font-size:10px;font-weight:bold;text-transform:uppercase;padding:2px 8px;border-radius:4px;margin-left:8px}
    .badge.ag{background:#fff3e0;color:#e67e22}
    .badge.ok{background:#e8f5e9;color:#2e7d32}
    .item-meta{font-size:12px;color:#888;margin-top:6px}
    .empty{color:#bbb;font-style:italic;font-size:13px}
    footer{margin-top:48px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#bbb;text-align:center}
    @media print{body{padding:20px}button{display:none!important}}
  </style></head><body>
  <h1>📋 Relatório do Paciente — Turma do Bem</h1>
  <p class="sub">Emitido em ${dataEmissao} &nbsp;·&nbsp; Dr(a). ${dentista}</p>
  <h2>Dados do Paciente</h2>
  <div class="grid">
    <div class="card"><span class="card-label">Nome</span><span class="card-val">${paciente.nome}</span></div>
    <div class="card"><span class="card-label">Idade</span><span class="card-val">${paciente.idade} anos</span></div>
    <div class="card"><span class="card-label">Localização</span><span class="card-val">${paciente.cidade}, ${paciente.pais}</span></div>
    <div class="card"><span class="card-label">Tipo de Dor</span><span class="card-val">${paciente.tipo_dor || '—'}</span></div>
    <div class="card"><span class="card-label">Renda Familiar</span><span class="card-val">${paciente.renda} SM</span></div>
    <div class="card"><span class="card-label">Dias com Dor</span><span class="card-val">${paciente.tempo_dor} dias</span></div>
  </div>
  <h2>Resumo do Tratamento</h2>
  <div class="stats">
    <div class="stat"><div class="stat-n">${historico.length}</div><div class="stat-l">Total Consultas</div></div>
    <div class="stat"><div class="stat-n green">${concluidas}</div><div class="stat-l">Concluídas</div></div>
    <div class="stat"><div class="stat-n orange">${agendadasCount}</div><div class="stat-l">Agendadas</div></div>
  </div>
  <h2>Histórico de Consultas</h2>
  ${itensHistorico}
  <footer>Relatório gerado automaticamente pelo sistema Dentista na Nuvem — Turma do Bem &nbsp;|&nbsp; Dr(a). ${dentista} &nbsp;|&nbsp; ${dataEmissao}</footer>
  </body></html>`;
}

export function imprimirRelatorio(paciente: PacienteRelatorio, dentista: string): void {
  const html = buildRelatorioHtml(paciente, dentista);
  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); win.focus(); setTimeout(() => win.print(), 500); }
}
