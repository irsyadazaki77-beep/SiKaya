/**
 * Utility functions for exporting reports and datasets.
 * Dynamically imports heavy libraries (jspdf, html2canvas, xlsx) only when requested by the user,
 * keeping initial bundle size minimal.
 */

export async function exportElementToPdf(
  element: HTMLElement,
  filename: string = 'Laporan_SiKaya.pdf',
  options?: {
    orientation?: 'p' | 'l';
    scale?: number;
  }
): Promise<void> {
  const [
    { default: jsPDF },
    { default: html2canvas }
  ] = await Promise.all([
    import('jspdf'),
    import('html2canvas')
  ]);

  const scale = options?.scale ?? 2;
  const orientation = options?.orientation ?? 'p';

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF(orientation, 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
}

export async function exportDataToExcel<T extends Record<string, any>>(
  data: T[],
  sheetName: string = 'Sheet1',
  filename: string = 'Export_Data.xlsx'
): Promise<void> {
  const XLSX = await import('xlsx');

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}
