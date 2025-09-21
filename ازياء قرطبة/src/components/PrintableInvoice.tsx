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
  employeeSignature?: string;
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
  :root {
    --print-primary: var(--primary, #155446);
    --print-secondary: var(--secondary, #C69A72);
    --print-secondary-soft: var(--secondary-soft, rgba(198, 154, 114, 0.18));
    --print-surface: var(--surface, #FDFBF7);
    --print-surface-alt: var(--surface-alt, #F6E9CA);
    --print-text: var(--text, #13312A);
    --print-muted: var(--muted, rgba(19, 49, 42, 0.7));
  }

  @page {
    size: A7 landscape;
    margin: 0.6cm;
  }

  body {
    margin: 0;
    background: var(--print-surface-alt);
    font-family: 'Cairo', 'Tajawal', 'Noto Kufi Arabic', sans-serif;
    direction: rtl;
    color: var(--print-text);
    font-size: 12px;
    line-height: 1.45;
  }

  * {
    box-sizing: border-box;
  }

  .receipt-wrapper {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.8rem;
  }

  .receipt-container {
    width: 100%;
    max-width: calc(10.5cm - 1.2cm);
    min-height: calc(7.4cm - 1.2cm);
    background: var(--print-surface);
    border: 1px solid var(--print-secondary);
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
    page-break-inside: avoid;
  }

  .receipt-inner {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
  }

  .receipt-header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: center;
  }

  .brand-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand-name {
    font-size: 18px;
    font-weight: 800;
    color: var(--print-primary);
    letter-spacing: 0.3px;
  }

  .brand-tagline {
    font-size: 10px;
    color: var(--print-muted);
  }

  .header-meta {
    display: grid;
    gap: 6px;
    background: var(--print-secondary-soft);
    border: 1px solid var(--print-secondary);
    border-radius: 9px;
    padding: 8px 12px;
  }

  .meta-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: baseline;
    font-size: 11px;
  }

  .meta-label {
    color: var(--print-muted);
    font-weight: 600;
  }

  .meta-value {
    color: var(--print-text);
    font-weight: 700;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1.1fr 0.9fr;
    gap: 10px;
    align-items: stretch;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    border-radius: 9px;
    border: 1px solid var(--print-secondary-soft);
    background: var(--print-surface);
    break-inside: avoid;
  }

  .card-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--print-primary);
  }

  .info-list {
    display: grid;
    gap: 6px;
  }

  .info-line {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    font-size: 11px;
  }

  .info-label {
    color: var(--print-muted);
    font-weight: 500;
  }

  .info-value {
    font-weight: 600;
    color: var(--print-text);
    word-break: break-word;
  }

  .amounts-card {
    background: linear-gradient(135deg, rgba(21, 84, 70, 0.08), rgba(246, 233, 202, 0.3));
    border-color: rgba(21, 84, 70, 0.2);
  }

  .amounts-grid {
    display: grid;
    gap: 6px;
  }

  .amount-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: baseline;
    padding: 6px 8px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(21, 84, 70, 0.1);
  }

  .amount-row.highlight {
    background: rgba(21, 84, 70, 0.12);
    border-color: rgba(21, 84, 70, 0.25);
  }

  .amount-label {
    font-size: 11px;
    color: var(--print-muted);
  }

  .amount-value {
    font-size: 17px;
    font-weight: 800;
    color: var(--print-text);
  }

  .notes-box {
    flex: 1;
    font-size: 10px;
    line-height: 1.5;
    color: var(--print-text);
    background: rgba(246, 233, 202, 0.35);
    border: 1px dashed var(--print-secondary);
    border-radius: 9px;
    padding: 8px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .notes-placeholder {
    color: rgba(19, 49, 42, 0.5);
  }

  .receipt-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12px;
    padding-top: 8px;
    border-top: 1px solid var(--print-secondary);
    font-size: 10px;
    color: var(--print-muted);
  }

  .signature {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 120px;
  }

  .signature-line {
    border-top: 1px solid var(--print-secondary);
    padding-top: 4px;
    text-align: center;
    color: var(--print-text);
    font-size: 11px;
    font-weight: 600;
    min-height: 16px;
  }

  @media screen and (max-width: 900px) {
    .receipt-wrapper {
      min-height: auto;
      padding: 1rem 0.5rem;
    }

    .receipt-container {
      max-width: 100%;
    }

    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  @media print {
    body {
      background: transparent;
    }

    .receipt-wrapper {
      min-height: auto;
      padding: 0;
    }

    .receipt-container {
      box-shadow: none;
    }

    .no-print {
      display: none !important;
    }
  }
`;

interface PrintableInvoiceProps {
  invoice: PrintableInvoiceData;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice }) => {
  const remaining = Math.max(invoice.total - invoice.paid, 0);
  const signature = invoice.employeeSignature?.trim();

  return (
    <div className="receipt-wrapper">
      <div className="receipt-container">
        <div className="receipt-inner">
          <header className="receipt-header">
            <div className="brand-block">
              <span className="brand-name">أزياء قرطبة</span>
              <span className="brand-tagline">نموذج فاتورة داخلي</span>
            </div>
            <div className="header-meta">
              <div className="meta-row">
                <span className="meta-label">رقم الفاتورة</span>
                {/* رقم_الفاتورة */}
                <span className="meta-value" data-field="رقم_الفاتورة">{invoice.id}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">تاريخ الإصدار</span>
                {/* تاريخ_الإصدار */}
                <span className="meta-value" data-field="تاريخ_الإصدار">{formatDate(invoice.receivedDate)}</span>
              </div>
            </div>
          </header>

          <div className="content-grid">
            <section className="card">
              <h2 className="card-title">بيانات الزبون</h2>
              <div className="info-list">
                <div className="info-line">
                  <span className="info-label">اسم الزبون</span>
                  {/* اسم_الزبون */}
                  <span className="info-value" data-field="اسم_الزبون">{invoice.customerName}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">رقم الهاتف</span>
                  {/* رقم_الهاتف */}
                  <span className="info-value" data-field="رقم_الهاتف">{invoice.phone}</span>
                </div>
              </div>
            </section>

            <section className="card amounts-card">
              <h2 className="card-title">الملخص المالي</h2>
              <div className="amounts-grid">
                <div className="amount-row">
                  <span className="amount-label">الإجمالي</span>
                  {/* المبلغ_الإجمالي */}
                  <span className="amount-value" data-field="المبلغ_الإجمالي">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
                <div className="amount-row highlight">
                  <span className="amount-label">الواصل</span>
                  {/* المبلغ_الواصل */}
                  <span className="amount-value" data-field="المبلغ_الواصل">
                    {formatCurrency(invoice.paid)}
                  </span>
                </div>
                <div className="amount-row">
                  <span className="amount-label">المتبقي</span>
                  {/* المبلغ_المتبقي */}
                  <span className="amount-value" data-field="المبلغ_المتبقي">
                    {formatCurrency(remaining)}
                  </span>
                </div>
              </div>
            </section>

            <section className="card">
              <h2 className="card-title">ملاحظات</h2>
              <div className="notes-box">
                {/* ملاحظات */}
                {invoice.notes ? (
                  <span data-field="ملاحظات">{invoice.notes}</span>
                ) : (
                  <span className="notes-placeholder">لا توجد ملاحظات</span>
                )}
              </div>
            </section>
          </div>

          <footer className="receipt-footer">
            <div className="signature">
              <span>توقيع الموظف</span>
              {/* توقيع_الموظف */}
              <span className="signature-line" data-field="توقيع_الموظف">
                {signature || '........................'}
              </span>
            </div>
            <div>شكراً لتسوقكم معنا</div>
          </footer>
        </div>
      </div>
    </div>
  );
};
