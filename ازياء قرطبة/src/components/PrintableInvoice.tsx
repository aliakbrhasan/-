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
    size: A5 portrait;
    margin: 1.2cm;
  }

  body {
    margin: 0;
    background: #f3ede0;
    font-family: 'Tajawal', 'Noto Kufi Arabic', sans-serif;
    direction: rtl;
    color: #13312A;
  }

  * {
    box-sizing: border-box;
  }

  .receipt-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1.2cm 0;
  }

  .receipt-container {
    width: 14.8cm;
    min-height: 21cm;
    background: #FDFBF7;
    border: 2px solid #C69A72;
    border-radius: 16px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow: 0 10px 25px rgba(19, 49, 42, 0.08);
    position: relative;
    overflow: hidden;
  }

  .receipt-container::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(198, 154, 114, 0.12), rgba(21, 84, 70, 0.08));
    pointer-events: none;
  }

  .receipt-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .receipt-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .brand {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .brand-name {
    font-size: 24px;
    font-weight: 700;
    color: #13312A;
    letter-spacing: 1px;
  }

  .brand-tagline {
    font-size: 14px;
    color: #155446;
  }

  .invoice-meta {
    background: rgba(246, 233, 202, 0.9);
    border: 1px solid rgba(198, 154, 114, 0.6);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 180px;
  }

  .meta-item {
    font-size: 14px;
    color: #13312A;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #155446;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 16px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: rgba(246, 233, 202, 0.55);
    border: 1px solid rgba(198, 154, 114, 0.4);
    border-radius: 12px;
    padding: 12px 14px;
  }

  .info-label {
    font-size: 13px;
    color: #155446;
  }

  .info-value {
    font-size: 15px;
    font-weight: 600;
  }

  .amounts-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .amount-card {
    padding: 14px;
    border-radius: 14px;
    border: 1px solid rgba(198, 154, 114, 0.45);
    background: white;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }

  .amount-card.highlight {
    background: rgba(21, 84, 70, 0.08);
    border-color: rgba(21, 84, 70, 0.35);
  }

  .amount-label {
    font-size: 13px;
    color: #155446;
    margin-bottom: 6px;
  }

  .amount-value {
    font-size: 18px;
    font-weight: 700;
    color: #13312A;
  }

  .dates-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .note-box {
    min-height: 80px;
    border: 1.5px dashed rgba(198, 154, 114, 0.65);
    border-radius: 14px;
    padding: 16px;
    background: rgba(246, 233, 202, 0.35);
    font-size: 14px;
    line-height: 1.7;
    color: #13312A;
  }

  .receipt-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    font-size: 13px;
    color: #155446;
  }

  .signature-box {
    min-width: 180px;
    border-top: 1.5px solid rgba(198, 154, 114, 0.9);
    padding-top: 12px;
    text-align: center;
  }

  @media print {
    body {
      background: white;
    }

    .receipt-wrapper {
      padding: 0;
    }

    .receipt-container {
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
        <div className="receipt-inner">
          <header className="receipt-header">
            <div className="brand">
              <span className="brand-name">أزياء قرطبة</span>
              <span className="brand-tagline">وصل فاتورة - نموذج داخلي</span>
            </div>
            <div className="invoice-meta">
              <span className="meta-item">رقم الفاتورة: {invoice.id}</span>
              <span className="meta-item">تاريخ الإصدار: {formatDate(invoice.receivedDate)}</span>
            </div>
          </header>

          <section className="section">
            <h2 className="section-title">بيانات الزبون</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">اسم الزبون</span>
                <span className="info-value">{invoice.customerName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">رقم الهاتف</span>
                <span className="info-value">{invoice.phone}</span>
              </div>
              {invoice.address ? (
                <div className="info-item" style={{ gridColumn: 'span 2' }}>
                  <span className="info-label">العنوان</span>
                  <span className="info-value">{invoice.address}</span>
                </div>
              ) : null}
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">الحساب المالي</h2>
            <div className="amounts-grid">
              <div className="amount-card">
                <div className="amount-label">المبلغ الكلي</div>
                <div className="amount-value">{formatCurrency(invoice.total)}</div>
              </div>
              <div className="amount-card highlight">
                <div className="amount-label">المبلغ الواصل</div>
                <div className="amount-value">{formatCurrency(invoice.paid)}</div>
              </div>
              <div className="amount-card">
                <div className="amount-label">المبلغ المتبقي</div>
                <div className="amount-value">{formatCurrency(remaining)}</div>
              </div>
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">التواريخ</h2>
            <div className="dates-grid">
              <div className="info-item">
                <span className="info-label">تاريخ الاستلام</span>
                <span className="info-value">{formatDate(invoice.receivedDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">تاريخ التسليم</span>
                <span className="info-value">{formatDate(invoice.deliveryDate)}</span>
              </div>
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">ملاحظات</h2>
            <div className="note-box">{invoice.notes || '—'}</div>
          </section>

          <footer className="receipt-footer">
            <div>
              <div>نشكر ثقتكم بخدمات أزياء قرطبة.</div>
              <div>يرجى الاحتفاظ بالوصل للمراجعة.</div>
            </div>
            <div className="signature-box">توقيع الموظف</div>
          </footer>
        </div>
      </div>
    </div>
  );
};
