import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PacienteRelatorio {
  nome: string;
  idade: number;
  cidade: string;
  pais: string;
  tipo_dor: string;
  renda: number;
  tempo_dor: number;
  score_match?: number;
  historico?: Array<{
    status?: string;
    data?: string;
    hora?: string;
    proc?: string;
    titulo?: string;
    dentista?: string;
  }>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function rgbOrange(): [number, number, number] { return [255, 140, 0]; }
function rgbDark():   [number, number, number] { return [30, 30, 30]; }
function rgbGray():   [number, number, number] { return [120, 120, 120]; }

function corUrgencia(tipoDor: string): [number, number, number] {
  const d = tipoDor.toLowerCase();
  if (d.includes('quebrado') || d === 'forte' || d === 'urgente') return [220, 38, 38];   // vermelho
  if (d === 'moderada') return [249, 115, 22];                                              // laranja
  return [34, 197, 94];                                                                     // verde
}

function labelUrgencia(tipoDor: string): string {
  const d = tipoDor.toLowerCase();
  if (d.includes('quebrado') || d === 'forte' || d === 'urgente') return 'URGÊNCIA ALTA';
  if (d === 'moderada') return 'URGÊNCIA MÉDIA';
  return 'URGÊNCIA BAIXA';
}

function scoreLabel(score: number): string {
  if (score >= 70) return 'ALTA PRIORIDADE';
  if (score >= 40) return 'MÉDIA PRIORIDADE';
  return 'BAIXA PRIORIDADE';
}

function scoreCor(score: number): [number, number, number] {
  if (score >= 70) return [220, 38, 38];
  if (score >= 40) return [249, 115, 22];
  return [34, 197, 94];
}

function adicionarRodape(doc: jsPDF, dentista: string): void {
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // Linha separadora
    doc.setDrawColor(...rgbOrange());
    doc.setLineWidth(0.4);
    doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);
    // Texto do rodapé
    doc.setFontSize(8);
    doc.setTextColor(...rgbGray());
    doc.text('Turma do Bem — Odontologia voluntária para jovens em vulnerabilidade social', 14, pageHeight - 12);
    doc.text(`Dr(a). ${dentista}  ·  Pág. ${i}/${pageCount}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
  }
}

// ─── Exportação principal ─────────────────────────────────────────────────────

export function imprimirRelatorio(paciente: PacienteRelatorio, dentista: string): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const historico = paciente.historico ?? [];
  const concluidas = historico.filter(h => h.status !== 'Agendado').length;
  const agendadas  = historico.filter(h => h.status === 'Agendado').length;
  const score      = paciente.score_match ?? 0;
  const dataEmissao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const nomeKebab = paciente.nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // ── Cabeçalho com faixa colorida ──────────────────────────────────────────
  doc.setFillColor(...rgbOrange());
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('TURMA DO BEM', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Odontologia voluntária para jovens em vulnerabilidade social', 14, 18);

  doc.setFontSize(9);
  doc.text(`Emitido em ${dataEmissao}`, pageWidth - 14, 11, { align: 'right' });
  doc.text(`Dr(a). ${dentista}`, pageWidth - 14, 18, { align: 'right' });

  // ── Título do relatório ──────────────────────────────────────────────────
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...rgbDark());
  doc.text(`Relatório Clínico — ${paciente.nome}`, 14, 40);

  // ── Badges: urgência + score ─────────────────────────────────────────────
  const corUrg = corUrgencia(paciente.tipo_dor || '');
  doc.setFillColor(...corUrg);
  doc.roundedRect(14, 44, 56, 8, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(labelUrgencia(paciente.tipo_dor || ''), 42, 49.5, { align: 'center' });

  if (score > 0) {
    const corScore = scoreCor(score);
    doc.setFillColor(...corScore);
    doc.roundedRect(74, 44, 52, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(`SCORE TdB: ${score} — ${scoreLabel(score)}`, 100, 49.5, { align: 'center' });
  }

  // ── Linha divisória ──────────────────────────────────────────────────────
  doc.setDrawColor(...rgbOrange());
  doc.setLineWidth(0.5);
  doc.line(14, 56, pageWidth - 14, 56);

  // ── Seção: Dados do Paciente ─────────────────────────────────────────────
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...rgbDark());
  doc.text('Dados do Paciente', 14, 63);

  autoTable(doc, {
    startY: 66,
    head: [['Campo', 'Informação']],
    body: [
      ['Idade',          `${paciente.idade} anos`],
      ['Cidade / País',  `${paciente.cidade}, ${paciente.pais}`],
      ['Tipo de Dor',    paciente.tipo_dor || '—'],
      ['Renda Familiar', `${paciente.renda} salário(s) mínimo(s)`],
      ['Dias com Dor',   `${paciente.tempo_dor} dias`],
      ...(score > 0 ? [['Score TdB', `${score} pts — ${scoreLabel(score)}`]] : []),
    ],
    headStyles:         { fillColor: rgbOrange(), textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 250, 245] },
    columnStyles:       { 0: { fontStyle: 'bold', cellWidth: 60 } },
    styles:             { fontSize: 10 },
  });

  const afterDados = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  // ── Seção: Resumo do Tratamento ──────────────────────────────────────────
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...rgbDark());
  doc.text('Resumo do Tratamento', 14, afterDados + 12);

  const statsY = afterDados + 16;
  doc.setFillColor(255, 248, 240);
  doc.setDrawColor(255, 224, 178);
  doc.roundedRect(14, statsY, pageWidth - 28, 28, 3, 3, 'FD');

  const cols: [number, number, number][] = [
    [255, 140,  0],   // laranja
    [141, 198, 63],   // verde
    [230, 126, 34],   // laranja escuro
  ];
  const values = [String(historico.length), String(concluidas), String(agendadas)];
  const labels = ['Total de Consultas', 'Concluídas', 'Agendadas'];
  const xs     = [pageWidth * 0.22, pageWidth * 0.5, pageWidth * 0.78];

  values.forEach((v, i) => {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cols[i]);
    doc.text(v, xs[i], statsY + 14, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...rgbGray());
    doc.text(labels[i], xs[i], statsY + 22, { align: 'center' });
  });

  // ── Seção: Histórico de Consultas ────────────────────────────────────────
  const afterStats = statsY + 34;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...rgbDark());
  doc.text('Histórico de Consultas', 14, afterStats);

  if (historico.length === 0) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...rgbGray());
    doc.text('Nenhuma consulta registrada.', 14, afterStats + 8);
  } else {
    autoTable(doc, {
      startY: afterStats + 4,
      head: [['Procedimento', 'Data', 'Hora', 'Dentista', 'Status']],
      body: historico.map(h => [
        h.proc || h.titulo || 'Procedimento',
        h.data  || '—',
        h.hora  || '—',
        `Dr(a). ${h.dentista || dentista}`,
        h.status || '—',
      ]),
      headStyles:         { fillColor: rgbOrange(), textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [255, 250, 245] },
      styles:             { fontSize: 9 },
      didParseCell: (data) => {
        // Colorir coluna Status
        if (data.column.index === 4 && data.section === 'body') {
          const val = String(data.cell.raw ?? '');
          if (val === 'Concluído' || val === 'concluido') {
            data.cell.styles.textColor = [22, 163, 74];
            data.cell.styles.fontStyle = 'bold';
          } else if (val === 'Agendado' || val === 'confirmado') {
            data.cell.styles.textColor = [249, 115, 22];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
    });
  }

  // ── Seção: Assinatura ────────────────────────────────────────────────────
  const afterHistorico = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? afterStats + 20;
  const assinaturaY = afterHistorico + 18;

  if (assinaturaY < 240) {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(pageWidth - 90, assinaturaY, pageWidth - 14, assinaturaY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...rgbGray());
    doc.text(`Dr(a). ${dentista}`, pageWidth - 52, assinaturaY + 6, { align: 'center' });
    doc.text('Dentista Voluntário — Turma do Bem', pageWidth - 52, assinaturaY + 12, { align: 'center' });
  }

  // ── Rodapé em todas as páginas ───────────────────────────────────────────
  adicionarRodape(doc, dentista);

  doc.save(`relatorio-${nomeKebab}.pdf`);
}
