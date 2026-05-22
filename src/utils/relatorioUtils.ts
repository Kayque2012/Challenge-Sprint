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
  historico?: Array<{
    status?: string;
    data?: string;
    hora?: string;
    proc?: string;
    titulo?: string;
    dentista?: string;
  }>;
}

export function imprimirRelatorio(paciente: PacienteRelatorio, dentista: string): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const historico = paciente.historico || [];
  const concluidas = historico.filter(h => h.status !== 'Agendado').length;
  const agendadas = historico.filter(h => h.status === 'Agendado').length;
  const dataEmissao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const nomeKebab = paciente.nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // Título
  doc.setFontSize(18);
  doc.setTextColor(255, 140, 0);
  doc.text(`Relatório Clínico — ${paciente.nome}`, pageWidth / 2, 20, { align: 'center' });

  // Sub-cabeçalho
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Turma do Bem  ·  Emitido em ${dataEmissao}  ·  Dr(a). ${dentista}`,
    pageWidth / 2, 28, { align: 'center' }
  );

  // Linha separadora
  doc.setDrawColor(255, 140, 0);
  doc.setLineWidth(0.5);
  doc.line(14, 33, pageWidth - 14, 33);

  // Seção: Dados do Paciente
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text('Dados do Paciente', 14, 41);

  autoTable(doc, {
    startY: 45,
    head: [['Campo', 'Informação']],
    body: [
      ['Idade',           `${paciente.idade} anos`],
      ['Cidade',          paciente.cidade],
      ['País',            paciente.pais],
      ['Tipo de Dor',     paciente.tipo_dor || '—'],
      ['Renda Familiar',  `${paciente.renda} salário(s) mínimo(s)`],
      ['Dias com Dor',    `${paciente.tempo_dor} dias`],
    ],
    headStyles:         { fillColor: [255, 140, 0] },
    alternateRowStyles: { fillColor: [255, 250, 245] },
    columnStyles:       { 0: { fontStyle: 'bold', cellWidth: 60 } },
  });

  const afterDados = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  // Seção: Resumo do Tratamento
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text('Resumo do Tratamento', 14, afterDados + 10);

  const statsY = afterDados + 14;
  doc.setFillColor(255, 248, 240);
  doc.setDrawColor(255, 224, 178);
  doc.roundedRect(14, statsY, pageWidth - 28, 24, 3, 3, 'FD');

  const cols = [pageWidth * 0.25, pageWidth * 0.5, pageWidth * 0.75];
  const numbers = [String(historico.length), String(concluidas), String(agendadas)];
  const colors: [number, number, number][] = [
    [255, 140, 0],
    [141, 198, 63],
    [230, 126, 34],
  ];
  const labels = ['Total de Consultas', 'Concluídas', 'Agendadas'];

  numbers.forEach((n, i) => {
    doc.setFontSize(18);
    doc.setTextColor(...colors[i]);
    doc.text(n, cols[i], statsY + 13, { align: 'center' });
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(labels[i], cols[i], statsY + 20, { align: 'center' });
  });

  // Seção: Histórico de Consultas
  const afterStats = statsY + 30;
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text('Histórico de Consultas', 14, afterStats);

  if (historico.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
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
      headStyles:         { fillColor: [255, 140, 0] },
      alternateRowStyles: { fillColor: [255, 250, 245] },
    });
  }

  doc.save(`relatorio-${nomeKebab}.pdf`);
}
