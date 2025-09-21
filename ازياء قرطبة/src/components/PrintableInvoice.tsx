import React from 'react';

export interface PrintableInvoiceData {
  id: string;
  customerName: string;
  phone: string;
  address?: string;
  total: number;
  paid: number;
  receivedDate: string;
  deliveryDate: string;
  notes?: string;
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ar-IQ', {
    style: 'currency',
    currency: 'IQD',
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));

export const receiptStyles = `
  @page {
    size: 105mm 74mm;
    margin: 5mm;
  }

  :root {
    --brand: var(--primary, #2a6f6a);
    --brand-600: var(--primary-foreground, #155446);
    --ink: #1f2937;
    --muted: #6b7280;
    --surface: #ffffff;
    --border: rgba(0, 0, 0, 0.15);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    direction: rtl;
    background: var(--surface);
    color: var(--ink);
    font-family: 'Cairo', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
  }

  .invoice-print-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: var(--surface);
  }

  .invoice--print {
    width: 100%;
    max-width: calc(105mm - 10mm);
    min-height: calc(74mm - 10mm);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 8px;
    display: grid;
    gap: 6px;
    grid-template-areas:
      'head head head'
      'client totals notes'
      'foot foot foot';
    grid-template-columns: repeat(3, 1fr);
    align-content: start;
    font: 600 10pt/1.4 'Cairo', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
    break-inside: avoid;
    page-break-inside: avoid;
    color: var(--ink);
  }

  .invoice--print > * {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .inv-head,
  .card,
  .inv-foot {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .inv-head {
    grid-area: head;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .store {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand {
    margin: 0;
    font-size: 12pt;
    color: var(--brand);
    font-weight: 700;
  }

  .muted {
    color: var(--muted);
    font-size: 9.5pt;
    font-weight: 500;
  }

  .meta {
    display: grid;
    gap: 4px;
    text-align: right;
  }

  .meta-row {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: flex-start;
    font-size: 9.5pt;
  }

  .label {
    color: var(--muted);
    font-weight: 600;
    font-size: 9.5pt;
  }

  .value {
    color: var(--ink);
    font-weight: 700;
    font-size: 10pt;
    min-width: 0;
  }

  .card {
    gap: 6px;
    background: var(--surface);
  }

  .card h2 {
    margin: 0;
    font-size: 11.5pt;
    font-weight: 700;
    color: var(--brand);
  }

  .client {
    grid-area: client;
  }

  .totals {
    grid-area: totals;
  }

  .notes {
    grid-area: notes;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .kpis {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
  }

  .kpi {
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    padding: 4px 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    text-align: center;
  }

  .kpi-value {
    font-size: 13pt;
    font-weight: 800;
    color: var(--ink);
  }

  .kpi-label {
    font-size: 9.5pt;
    color: var(--muted);
  }

  .note-text {
    font-size: 9.5pt;
    color: var(--muted);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .inv-foot {
    grid-area: foot;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    font-size: 9.5pt;
  }

  .sign {
    color: var(--muted);
    font-weight: 600;
  }

  .thank {
    color: var(--brand);
    font-size: 11pt;
    font-weight: 800;
  }

  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media print {
    body {
      margin: 0;
      background: var(--surface);
    }

    .no-print {
      display: none !important;
    }

    .invoice-print-wrapper {
      padding: 0;
      min-height: auto;
    }

    .invoice--print {
      box-shadow: none !important;
      filter: none !important;
    }
  }
`;

interface PrintableInvoiceProps {
  invoice: PrintableInvoiceData;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice }) => {
  const remaining = Math.max(invoice.total - invoice.paid, 0);

  return (
    <div className="invoice-print-wrapper">
      <div className="invoice--print" dir="rtl">
        {/* يتم تمرير القيم الديناميكية من كائن invoice في JSX أدناه */}
        <header className="inv-head">
          <div className="store">
            <h1 className="brand">أزياء قرطبة</h1>
            <small className="muted">وصل فاتورة · نموذج داخلي</small>
          </div>
          <div className="meta">
            <div className="meta-row">
              <span className="label">رقم الفاتورة:</span>
              <span className="value">{invoice.id}</span>
            </div>
            <div className="meta-row">
              <span className="label">تاريخ الإصدار:</span>
              <span className="value">{formatDate(invoice.receivedDate)}</span>
            </div>
          </div>
        </header>

        <section className="client card">
          <h2>بيانات الزبون</h2>
          <div className="row">
            <span className="label">الاسم:</span>
            <span className="value truncate">{invoice.customerName}</span>
          </div>
          <div className="row">
            <span className="label">الهاتف:</span>
            <span className="value">{invoice.phone}</span>
          </div>
          {invoice.address && (
            <div className="row">
              <span className="label">العنوان:</span>
              <span className="value truncate">{invoice.address}</span>
            </div>
          )}
        </section>

        <section className="totals card">
          <h2>الحساب المالي</h2>
          <div className="kpis">
            <div className="kpi">
              <div className="kpi-value">{formatCurrency(invoice.total)}</div>
              <div className="kpi-label">المبلغ الكلي</div>
            </div>
            <div className="kpi">
              <div className="kpi-value">{formatCurrency(invoice.paid)}</div>
              <div className="kpi-label">المبلغ الواصل</div>
            </div>
            <div className="kpi">
              <div className="kpi-value">{formatCurrency(remaining)}</div>
              <div className="kpi-label">المتبقي</div>
            </div>
          </div>
        </section>

        <section className="notes card">
          <h2>ملاحظات</h2>
          <div className="note-text">
            {invoice.notes?.length ? invoice.notes : 'يرجى الاحتفاظ بوصل الفاتورة للمراجعة.'}
          </div>
        </section>

        <footer className="inv-foot">
          <div className="sign muted">توقيع الموظف: ____________</div>
          <div className="thank">شكراً لتسوقكم</div>
        </footer>
      </div>
    </div>
  );
};
