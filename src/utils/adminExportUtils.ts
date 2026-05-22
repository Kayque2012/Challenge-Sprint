import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export function exportarPacientesPDF(pacientes: PacienteExport[]): void {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Relatório de Pacientes — Turma do Bem', 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 14, 26);
  autoTable(doc, {
    startY: 32,
    head: [['Nome', 'E-mail', 'Cidade', 'País', 'Tipo de Dor']],
    body: pacientes.map(p => [
      p.nomePaciente || p.nome || '—',
      p.email,
      p.cidade,
      p.pais,
      p.tipoDor || '—',
    ]),
    headStyles: { fillColor: [255, 140, 0] },
    alternateRowStyles: { fillColor: [255, 250, 245] },
  });
  doc.save('pacientes-turma-do-bem.pdf');
}

export function exportarPacientesCSV(pacientes: PacienteExport[]): void {
  const cabecalho = ['Nome', 'E-mail', 'Cidade', 'País', 'Tipo de Dor'];
  const linhas = pacientes.map(p => [
    p.nomePaciente || p.nome || '',
    p.email,
    p.cidade,
    p.pais,
    p.tipoDor || '',
  ]);
  baixarCSV([cabecalho, ...linhas], 'pacientes-turma-do-bem.csv');
}

export function exportarDentistasPDF(dentistas: DentistaExport[]): void {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Relatório de Dentistas — Turma do Bem', 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 14, 26);
  autoTable(doc, {
    startY: 32,
    head: [['Nome', 'E-mail', 'Cidade', 'CRO']],
    body: dentistas.map(d => [
      d.nomeDentista || d.nome || '—',
      d.email,
      d.cidade,
      d.cro || '—',
    ]),
    headStyles: { fillColor: [255, 140, 0] },
    alternateRowStyles: { fillColor: [255, 250, 245] },
  });
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

export function exportarAtendimentosPDF(agendamentos: AgendamentoExport[]): void {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text('Agenda da Rede — Turma do Bem', 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 14, 26);
  autoTable(doc, {
    startY: 32,
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
    headStyles: { fillColor: [141, 198, 63] },
    alternateRowStyles: { fillColor: [245, 255, 245] },
  });
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
