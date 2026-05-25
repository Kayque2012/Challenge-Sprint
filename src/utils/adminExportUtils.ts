import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface PacienteExport {
  nomePaciente?: string;
  nome?: string;
  email: string;
  cidade: string;
  pais: string;
  tipoDor?: string;
}

interface DentistaExport {
  nomeDentista?: string;
  nome?: string;
  email: string;
  cidade: string;
  cro?: string;
}

interface AgendamentoExport {
  paciente: string;
  prioridade: string;
  proc: string;
  dentista: string;
  data: string;
  hora: string;
  cidade: string;
}

// ─── Helpers de cores ──────────────────────────────────────────────────────────

function rgbOrange(): [number, number, number] { return [255, 140, 0]; }
function rgbGreen():  [number, number, number] { return [141, 198, 63]; }
function rgbDark():   [number, number, number] { return [30, 30, 30]; }
function rgbGray():   [number, number, number] { return [120, 120, 120]; }

function labelUrgenciaDor(tipoDor: string): string {
  const d = (tipoDor ?? '').toLowerCase();
  if (d.includes('quebrado') || d === 'forte' || d === 'urgente') return 'ALTA';
  if (d === 'moderada') return 'MÉDIA';
  return 'BAIXA';
}

function corPrioridade(prioridade: string): [number, number, number] {
  const p = (prioridade ?? '').toLowerCase();
  if (p === 'urgente') return [220, 38, 38];
  if (p === 'alta') return [249, 115, 22];
  return [34, 197, 94];
}

// ─── Cabeçalho e rodapé comuns ─────────────────────────────────────────────────

function adicionarCabecalho(doc: jsPDF, titulo: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const dataEmissao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  // Faixa laranja
  doc.setFillColor(...rgbOrange());
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Nome da ONG
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('TURMA DO BEM', 14, 11);

  // Subtítulo
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Odontologia voluntária para jovens em vulnerabilidade social', 14, 18);

  // Data (canto direito)
  doc.setFontSize(9);
  doc.text(`Emitido em ${dataEmissao}`, pageWidth - 14, 11, { align: 'right' });
  doc.text('Painel Administrativo', pageWidth - 14, 18, { align: 'right' });

  // Título do relatório
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...rgbDark());
  doc.text(titulo, 14, 40);

  // Linha divisória
  doc.setDrawColor(...rgbOrange());
  doc.setLineWidth(0.5);
  doc.line(14, 45, pageWidth - 14, 45);
}

function adicionarRodape(doc: jsPDF, subtitulo: string): void {
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...rgbOrange());
    doc.setLineWidth(0.4);
    doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);
    doc.setFontSize(8);
    doc.setTextColor(...rgbGray());
    doc.text('Turma do Bem — Odontologia voluntária para jovens em vulnerabilidade social', 14, pageHeight - 12);
    doc.text(`${subtitulo}  ·  Pág. ${i}/${pageCount}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
  }
}

function caixaStats(
  doc: jsPDF,
  startY: number,
  valores: string[],
  rotulos: string[],
  cores: [number, number, number][],
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const boxH = 28;

  doc.setFillColor(255, 248, 240);
  doc.setDrawColor(255, 224, 178);
  doc.roundedRect(14, startY, pageWidth - 28, boxH, 3, 3, 'FD');

  const xs = valores.map((_, i) => 14 + ((pageWidth - 28) / valores.length) * (i + 0.5));

  valores.forEach((v, i) => {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cores[i]);
    doc.text(v, xs[i], startY + 13, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...rgbGray());
    doc.text(rotulos[i], xs[i], startY + 21, { align: 'center' });
  });
}

// ─── CSV ───────────────────────────────────────────────────────────────────────

function baixarCSV(linhas: string[][], nomeArquivo: string): void {
  const bom = '﻿';
  const csv =
    bom +
    linhas
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Exportação de Pacientes ───────────────────────────────────────────────────

export function exportarPacientesPDF(pacientes: PacienteExport[]): void {
  const doc = new jsPDF();

  adicionarCabecalho(doc, 'Relatório de Pacientes');

  // ── Estatísticas rápidas ─────────────────────────────────────────────────────
  const alta   = pacientes.filter(p => labelUrgenciaDor(p.tipoDor ?? '') === 'ALTA').length;
  const media  = pacientes.filter(p => labelUrgenciaDor(p.tipoDor ?? '') === 'MÉDIA').length;
  const baixa  = pacientes.filter(p => labelUrgenciaDor(p.tipoDor ?? '') === 'BAIXA').length;

  caixaStats(
    doc,
    50,
    [String(pacientes.length), String(alta), String(media), String(baixa)],
    ['Total de Pacientes', 'Urgência Alta', 'Urgência Média', 'Urgência Baixa'],
    [rgbOrange(), [220, 38, 38], [249, 115, 22], [34, 197, 94]],
  );

  // ── Seção: título da tabela ──────────────────────────────────────────────────
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...rgbDark());
  doc.text('Lista de Pacientes', 14, 90);

  // ── Tabela ───────────────────────────────────────────────────────────────────
  autoTable(doc, {
    startY: 93,
    head: [['Nome', 'E-mail', 'Cidade', 'País', 'Tipo de Dor', 'Urgência']],
    body: pacientes.map(p => [
      p.nomePaciente || p.nome || '—',
      p.email,
      p.cidade,
      p.pais,
      p.tipoDor || '—',
      labelUrgenciaDor(p.tipoDor ?? ''),
    ]),
    headStyles: { fillColor: rgbOrange(), textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 250, 245] },
    columnStyles: { 4: { cellWidth: 30 }, 5: { cellWidth: 22, fontStyle: 'bold' } },
    styles: { fontSize: 9 },
    didParseCell: (data) => {
      if (data.column.index === 5 && data.section === 'body') {
        const val = String(data.cell.raw ?? '');
        if (val === 'ALTA')  data.cell.styles.textColor = [220, 38, 38];
        if (val === 'MÉDIA') data.cell.styles.textColor = [249, 115, 22];
        if (val === 'BAIXA') data.cell.styles.textColor = [34, 197, 94];
      }
    },
  });

  adicionarRodape(doc, 'Relatório de Pacientes');
  doc.save('pacientes-turma-do-bem.pdf');
}

export function exportarPacientesCSV(pacientes: PacienteExport[]): void {
  const cabecalho = ['Nome', 'E-mail', 'Cidade', 'País', 'Tipo de Dor', 'Urgência'];
  const linhas = pacientes.map(p => [
    p.nomePaciente || p.nome || '',
    p.email,
    p.cidade,
    p.pais,
    p.tipoDor || '',
    labelUrgenciaDor(p.tipoDor ?? ''),
  ]);
  baixarCSV([cabecalho, ...linhas], 'pacientes-turma-do-bem.csv');
}

// ─── Exportação de Dentistas ───────────────────────────────────────────────────

export function exportarDentistasPDF(dentistas: DentistaExport[]): void {
  const doc = new jsPDF();

  adicionarCabecalho(doc, 'Relatório de Dentistas Voluntários');

  // ── Estatísticas rápidas ─────────────────────────────────────────────────────
  const cidades = new Set(dentistas.map(d => d.cidade).filter(Boolean)).size;

  caixaStats(
    doc,
    50,
    [String(dentistas.length), String(cidades)],
    ['Dentistas Voluntários', 'Cidades Atendidas'],
    [rgbOrange(), rgbGreen()],
  );

  // ── Seção: título da tabela ──────────────────────────────────────────────────
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...rgbDark());
  doc.text('Rede de Voluntários', 14, 90);

  // ── Tabela ───────────────────────────────────────────────────────────────────
  autoTable(doc, {
    startY: 93,
    head: [['Nome', 'E-mail', 'Cidade', 'CRO']],
    body: dentistas.map(d => [
      d.nomeDentista || d.nome || '—',
      d.email,
      d.cidade,
      d.cro || '—',
    ]),
    headStyles: { fillColor: rgbOrange(), textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 250, 245] },
    columnStyles: { 0: { fontStyle: 'bold' } },
    styles: { fontSize: 9 },
  });

  adicionarRodape(doc, 'Relatório de Dentistas');
  doc.save('dentistas-turma-do-bem.pdf');
}

export function exportarDentistasCSV(dentistas: DentistaExport[]): void {
  const cabecalho = ['Nome', 'E-mail', 'Cidade', 'CRO'];
  const linhas = dentistas.map(d => [
    d.nomeDentista || d.nome || '',
    d.email,
    d.cidade,
    d.cro || '',
  ]);
  baixarCSV([cabecalho, ...linhas], 'dentistas-turma-do-bem.csv');
}

// ─── Exportação de Atendimentos / Agenda ───────────────────────────────────────

export function exportarAtendimentosPDF(agendamentos: AgendamentoExport[]): void {
  const doc = new jsPDF({ orientation: 'landscape' });

  adicionarCabecalho(doc, 'Agenda da Rede — Atendimentos Voluntários');

  // ── Estatísticas rápidas ─────────────────────────────────────────────────────
  const urgentes = agendamentos.filter(a => a.prioridade?.toLowerCase() === 'urgente').length;
  const altas    = agendamentos.filter(a => a.prioridade?.toLowerCase() === 'alta').length;
  const normais  = agendamentos.length - urgentes - altas;

  caixaStats(
    doc,
    50,
    [String(agendamentos.length), String(urgentes), String(altas), String(normais)],
    ['Total de Atendimentos', 'Prioridade Urgente', 'Prioridade Alta', 'Prioridade Normal'],
    [rgbOrange(), [220, 38, 38], [249, 115, 22], [34, 197, 94]],
  );

  // ── Seção: título da tabela ──────────────────────────────────────────────────
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...rgbDark());
  doc.text('Lista de Atendimentos', 14, 90);

  // ── Tabela ───────────────────────────────────────────────────────────────────
  autoTable(doc, {
    startY: 93,
    head: [['Paciente', 'Prioridade', 'Procedimento', 'Dentista', 'Data', 'Hora', 'Cidade']],
    body: agendamentos.map(ag => [
      ag.paciente,
      ag.prioridade,
      ag.proc,
      ag.dentista,
      ag.data,
      ag.hora,
      ag.cidade,
    ]),
    headStyles: { fillColor: rgbOrange(), textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 250, 245] },
    columnStyles: { 1: { fontStyle: 'bold', cellWidth: 28 } },
    styles: { fontSize: 9 },
    didParseCell: (data) => {
      if (data.column.index === 1 && data.section === 'body') {
        const [r, g, b] = corPrioridade(String(data.cell.raw ?? ''));
        data.cell.styles.textColor = [r, g, b];
      }
    },
  });

  adicionarRodape(doc, 'Agenda da Rede');
  doc.save('agenda-turma-do-bem.pdf');
}

export function exportarAtendimentosCSV(agendamentos: AgendamentoExport[]): void {
  const cabecalho = ['Paciente', 'Prioridade', 'Procedimento', 'Dentista', 'Data', 'Hora', 'Cidade'];
  const linhas = agendamentos.map(ag => [
    ag.paciente,
    ag.prioridade,
    ag.proc,
    ag.dentista,
    ag.data,
    ag.hora,
    ag.cidade,
  ]);
  baixarCSV([cabecalho, ...linhas], 'agenda-turma-do-bem.csv');
}
