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
  @page {
    size: A7 landscape;
    margin: 5mm;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: var(--surface, #f7f3eb);
    color: var(--text, #13312a);
    font-family: 'Cairo', 'Tajawal', 'Noto Kufi Arabic', sans-serif;
    direction: rtl;
    font-size: 11pt;
    line-height: 1.45;
  }

  .no-print,
  .print-hidden {
    display: none !important;
  }

  .receipt-wrapper {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10mm 0;
    background: none;
  }

  .receipt-container {
    width: calc(105mm - 10mm);
    min-height: calc(74mm - 10mm);
    background: var(--surface, #fdfbf7);
    border: 1.2px solid var(--muted, #d9cbb3);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 10px 24px rgba(19, 49, 42, 0.12);
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .receipt-header,
  .content-columns,
  .receipt-footer,
  .column,
  .amount-card {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .receipt-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    align-items: start;
  }

  .brand {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--primary, #155446);
    letter-spacing: 0.3px;
  }

  .brand-tagline {
    font-size: 10px;
    color: var(--muted, #9aa39a);
  }

  .invoice-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, auto));
    gap: 6px 14px;
    justify-content: end;
    font-size: 10pt;
    color: var(--text, #13312a);
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .meta-label {
    font-size: 9pt;
    color: var(--muted, #9aa39a);
  }

  .meta-value {
    font-size: 11pt;
    font-weight: 600;
    color: var(--text, #13312a);
  }

  .content-columns {
    display: grid;
    grid-template-columns: 1.1fr 1.2fr 0.9fr;
    gap: 8px;
    align-items: stretch;
  }

  .column {
    border: 1px solid var(--muted, rgba(217, 203, 179, 0.7));
    border-radius: 8px;
    padding: 8px 10px;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .column-title {
    font-size: 11pt;
    font-weight: 700;
    color: var(--primary, #155446);
    margin: 0;
  }

  .info-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .info-label {
    font-size: 9pt;
    color: var(--muted, #9aa39a);
  }

  .info-value {
    font-size: 11pt;
    font-weight: 600;
    color: var(--text, #13312a);
    word-break: break-word;
  }

  .amount-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }

  .amount-card {
    border-radius: 8px;
    border: 1px solid var(--primary, rgba(21, 84, 70, 0.25));
    background: var(--surface-alt, rgba(21, 84, 70, 0.06));
    padding: 8px 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .amount-card.highlight {
    background: var(--primary, #155446);
    color: #ffffff;
    border-color: var(--primary, #155446);
  }

  .amount-card.highlight .amount-label,
  .amount-card.highlight .amount-value {
    color: #ffffff;
  }

  .amount-label {
    font-size: 9pt;
    color: var(--primary, #155446);
  }

  .amount-value {
    font-size: 15pt;
    font-weight: 700;
    color: var(--text, #13312a);
  }

  .notes-box {
    flex: 1;
    min-height: 48px;
    border: 1px dashed var(--muted, #cbbfa5);
    border-radius: 6px;
    padding: 6px 8px;
    background: var(--surface-alt, rgba(246, 233, 202, 0.35));
    font-size: 10pt;
    line-height: 1.4;
    color: var(--text, #13312a);
    display: flex;
    align-items: flex-start;
  }

  .notes-placeholder {
    opacity: 0.6;
  }

  .receipt-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding-top: 6px;
    border-top: 1px solid var(--muted, #d9cbb3);
    font-size: 9.5pt;
    color: var(--muted, #9aa39a);
    flex-wrap: wrap;
  }

  .signature-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 90px;
  }

  .signature-label {
    font-size: 9pt;
    color: var(--muted, #9aa39a);
  }

  .signature-line {
    width: 100%;
    border-bottom: 1.5px solid var(--muted, #cbbfa5);
    padding-bottom: 4px;
    text-align: center;
    font-size: 10pt;
    color: var(--text, #13312a);
  }

  .footer-note {
    font-size: 10pt;
    font-weight: 600;
    color: var(--primary, #155446);
  }

  @media screen and (max-width: 768px) {
    .receipt-wrapper {
      padding: 16px;
    }

    .receipt-container {
      width: 100%;
      min-height: auto;
    }

    .content-columns {
      grid-template-columns: 1fr;
    }

    .amount-summary {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
      margin: 0 auto;
      width: calc(105mm - 10mm);
      min-height: calc(74mm - 10mm);
      box-shadow: none;
    }
  }
`;

interface PrintableInvoiceProps {
  invoice: PrintableInvoiceData;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice }) => {
  const remaining = Math.max(invoice.total - invoice.paid, 0);

  return (
    <div className="receipt-wrapper">
      <div className="receipt-container">
        <header className="receipt-header">
          <div className="brand">
            <span className="brand-name">أزياء قرطبة</span>
            <span className="brand-tagline">وحدة الفوترة الداخلية</span>
          </div>
          <div className="invoice-meta">
            <div className="meta-item">
              <span className="meta-label">رقم الفاتورة</span>
              <span className="meta-value">
                {/* رقم_الفاتورة */}
                {invoice.id}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">تاريخ الإصدار</span>
              <span className="meta-value">
                {/* تاريخ_الإصدار */}
                {formatDate(invoice.receivedDate)}
              </span>
            </div>
          </div>
        </header>

        <div className="content-columns">
          <section className="column customer-column">
            <h2 className="column-title">بيانات الزبون</h2>
            <div className="info-block">
              <span className="info-label">الاسم</span>
              <span className="info-value">
                {/* اسم_الزبون */}
                {invoice.customerName}
              </span>
            </div>
            <div className="info-block">
              <span className="info-label">رقم الهاتف</span>
              <span className="info-value">
                {/* رقم_الهاتف */}
                {invoice.phone}
              </span>
            </div>
            {invoice.address && (
              <div className="info-block">
                <span className="info-label">العنوان</span>
                <span className="info-value">{invoice.address}</span>
              </div>
            )}
          </section>

          <section className="column amounts-column">
            <h2 className="column-title">الملخّص المالي</h2>
            <div className="amount-summary">
              <div className="amount-card">
                <span className="amount-label">الإجمالي</span>
                <span className="amount-value">
                  {/* المبلغ_الإجمالي */}
                  {formatCurrency(invoice.total)}
                </span>
              </div>
              <div className="amount-card highlight">
                <span className="amount-label">المبلغ الواصل</span>
                <span className="amount-value">
                  {/* المبلغ_الواصل */}
                  {formatCurrency(invoice.paid)}
                </span>
              </div>
              <div className="amount-card">
                <span className="amount-label">المتبقي</span>
                <span className="amount-value">
                  {/* المبلغ_المتبقي */}
                  {formatCurrency(remaining)}
                </span>
              </div>
            </div>
          </section>

          <section className="column notes-column">
            <h2 className="column-title">ملاحظات</h2>
            <div className={`notes-box ${invoice.notes ? '' : 'notes-placeholder'}`}>
              {invoice.notes ? (
                <span>
                  {/* ملاحظات */}
                  {invoice.notes}
                </span>
              ) : (
                'لا توجد ملاحظات مسجلة'
              )}
            </div>
          </section>
        </div>

        <footer className="receipt-footer">
          <div className="signature-area">
            <span className="signature-label">توقيع الموظف</span>
            <span className="signature-line">
              {/* توقيع_الموظف */}
              {invoice.employeeSignature ?? '................'}
            </span>
          </div>
          <div className="footer-note">شكراً لتسوقكم معنا</div>
        </footer>
      </div>
    </div>
  );
};
