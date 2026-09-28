'use client';

import React from 'react';
import { ERPDocument, ProposalSection } from '@/types/documentEngine';
import LetterheadHeader from './LetterheadHeader';
import LetterheadFooter from './LetterheadFooter';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DocumentLayoutProps {
  document: ERPDocument;
  isPreview?: boolean;
}

export default function DocumentLayout({ document, isPreview = false }: DocumentLayoutProps) {
  const isSow =
    document.type === 'proposal' &&
    (!!document.proposalHeadline?.toLowerCase().includes('statement of work') ||
      !!document.proposalHeadline?.toLowerCase().includes('sow'));

  const getDocumentTag = () => {
    switch (document.type) {
      case 'invoice':
        return `INVOICE #${document.docNumber}`;
      case 'receipt':
        return `PAYMENT RECEIPT #${document.docNumber}`;
      case 'quotation':
        return `QUOTATION #${document.docNumber}`;
      case 'proposal':
        return isSow ? `STATEMENT OF WORK #${document.docNumber}` : `PROPOSAL #${document.docNumber}`;
      default:
        return `#${document.docNumber}`;
    }
  };

  const defaultSowSections: ProposalSection[] = [
    {
      id: 'sow-1',
      sectionNumber: '01',
      title: 'Scope of Work',
      content:
        document.notes ||
        'OMNYSYNC will design, build, and deliver the agreed digital product including discovery, UI/UX, engineering, QA, and launch support as outlined in the line items below.',
    },
    {
      id: 'sow-2',
      sectionNumber: '02',
      title: 'Deliverables & Milestones',
      content:
        'Phased delivery with milestone reviews. Each invoice milestone corresponds to accepted deliverables. Change requests outside scope are quoted separately.',
    },
    {
      id: 'sow-3',
      sectionNumber: '03',
      title: 'Timeline & Assumptions',
      content:
        'Timeline assumes timely client feedback (≤3 business days). Client provides brand assets, content, and staging access as required.',
    },
    {
      id: 'sow-4',
      sectionNumber: '04',
      title: 'Commercial Terms',
      content:
        document.terms ||
        'Fees in PKR as listed. 40% kickoff, balance on milestones. Net 15. Intellectual property transfers upon full payment.',
    },
  ];

  const proposalSections: ProposalSection[] =
    document.sections && document.sections.length > 0 ? document.sections : isSow ? defaultSowSections : [];

  const formatCurrency = (amount: number) => {
    const symbolMap: Record<string, string> = {
      USD: '$',
      PKR: 'Rs. ',
      GBP: '£',
      EUR: '€',
    };
    const prefix = symbolMap[document.currency] || '$';
    const locale = document.currency === 'PKR' ? 'en-PK' : 'en-US';
    return `${prefix}${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div
      className={`relative w-full bg-white text-[#1e293b] font-sans flex flex-col justify-between shadow-2xl print:shadow-none print:m-0 print:w-full min-h-[1050px] ${
        isPreview ? 'scale-[0.9] transform-origin-top max-w-[800px] mx-auto border border-[#cbd5e1]' : 'max-w-[850px] mx-auto my-6 border border-[#cbd5e1]'
      }`}
    >
      {/* Background Watermark Graphics */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] overflow-hidden z-0">
        <svg viewBox="0 0 500 500" className="w-[550px] h-[550px]" fill="none">
          <ellipse cx="250" cy="250" rx="220" ry="80" transform="rotate(-25 250 250)" stroke="#0B132B" strokeWidth="16" />
          <ellipse cx="250" cy="250" rx="220" ry="80" transform="rotate(65 250 250)" stroke="#480CA8" strokeWidth="12" />
          <circle cx="250" cy="250" r="50" fill="#0B132B" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header Component */}
        <LetterheadHeader documentTag={getDocumentTag()} />

        {/* Content Body */}
        <main className="p-8 space-y-6 flex-1 text-slate-800">
          {/* Metadata Block: Prepared For & Document Attributes */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200">
            {/* Prepared For Client Box */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                PREPARED FOR
              </span>
              <h2 className="text-xl font-extrabold text-[#0B132B] tracking-tight">
                {document.clientCompany || document.clientName}
              </h2>
              {document.clientName && document.clientCompany && (
                <p className="text-xs font-semibold text-slate-600">Attn: {document.clientName}</p>
              )}
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">{document.clientAddress}</p>
              {document.clientTaxId && (
                <p className="text-[11px] font-mono text-slate-500">Tax ID / NTN: {document.clientTaxId}</p>
              )}
            </div>

            {/* Document Attributes Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-right min-w-[220px]">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Issue Date
                </span>
                <span className="text-xs font-extrabold text-[#0B132B]">{document.issueDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {document.type === 'quotation' ? 'Validity Date' : 'Due Date'}
                </span>
                <span className="text-xs font-extrabold text-[#0B132B]">{document.dueDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Status
                </span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0B132B]/10 text-[#0B132B]">
                  {document.status}
                </span>
              </div>
            </div>
          </div>

          
          {document.type === 'quotation' && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-900 print:break-inside-avoid">
              <p className="font-extrabold uppercase tracking-wider text-[10px] text-sky-700">Quotation</p>
              <p className="mt-1 leading-relaxed">
                This quotation is valid until <strong>{document.dueDate}</strong>. Prices are in{' '}
                <strong>{document.currency}</strong> and exclude change requests outside the listed scope.
              </p>
            </div>
          )}

          {document.type === 'invoice' && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-950 print:break-inside-avoid">
              <p className="font-extrabold uppercase tracking-wider text-[10px] text-amber-700">Invoice due</p>
              <p className="mt-1 leading-relaxed">
                Please remit <strong>{formatCurrency(document.grandTotal)}</strong> by{' '}
                <strong>{document.dueDate}</strong>. Reference <strong>{document.docNumber}</strong> on your transfer.
              </p>
            </div>
          )}

          {/* Special Proposal Headline & Subhead (if proposal) */}
          {document.type === 'proposal' && (
            <div className="py-4 space-y-2">
              <h1 className="text-2xl font-black text-[#0B132B] leading-tight">
                {document.proposalHeadline ||
                  (isSow ? 'Statement of Work' : 'Project Proposal')}
              </h1>
              <p className="text-sm font-semibold text-indigo-900">
                {document.proposalSubhead ||
                  'Prepared by OMNYSYNC — websites, custom software, SEO & apps for home-services brands.'}
              </p>
            </div>
          )}

          {/* Proposal Multi-Section Renderer */}
          {document.type === 'proposal' && proposalSections.length > 0 && (
            <div className="space-y-8">
              {proposalSections.map((sec) => (
                <div key={sec.id} className="space-y-3 print:break-inside-avoid">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700 block">
                    {sec.sectionNumber}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0B132B] border-b border-slate-200 pb-1">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>

                  {/* Bullet Points */}
                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 font-medium">
                      {sec.bulletPoints.map((bp, idx) => (
                        <li key={idx}>{bp}</li>
                      ))}
                    </ul>
                  )}

                  {/* Callout Box */}
                  {sec.calloutBox && (
                    <div className="bg-[#e6f4f1] border-l-4 border-[#2dd4bf] p-4 rounded-r-xl space-y-1">
                      <h4 className="text-xs font-bold text-[#052e24]">{sec.calloutBox.title}</h4>
                      <p className="text-xs text-[#0f5142]">{sec.calloutBox.text}</p>
                    </div>
                  )}

                  {/* Section Table */}
                  {sec.tableData && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mt-3">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0B132B] text-white font-bold">
                          <tr>
                            {sec.tableData.headers.map((h, i) => (
                              <th key={i} className="p-2.5">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                          {sec.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2.5">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Standard Document Line Items Table */}
          {document.items && document.items.length > 0 && (
            <div className="space-y-3 print:break-inside-avoid">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Itemized Schedule & Services
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B132B] text-white font-extrabold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Item / Service</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total ({document.currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {document.items.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                        <td className="p-3 space-y-0.5">
                          <div className="font-bold text-[#0B132B]">{item.description}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            SKU: {item.skuOrCode} {item.warehouseName ? `| Warehouse: ${item.warehouseName}` : ''}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {item.quantity} {item.unitName}
                        </td>
                        <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-3 text-right font-extrabold text-[#0B132B]">
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculations Box */}
              <div className="flex justify-end pt-2">
                <div className="w-full max-w-xs space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-bold">{formatCurrency(document.subtotal)}</span>
                  </div>
                  {document.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span className="font-bold">-{formatCurrency(document.discountAmount)}</span>
                    </div>
                  )}
                  {document.taxAmount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Tax ({document.taxRate}%):</span>
                      <span className="font-bold">+{formatCurrency(document.taxAmount)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-black text-[#0B132B]">
                    <span>Grand Total:</span>
                    <span className="text-[#480CA8] font-black">{formatCurrency(document.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms & Notes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200">
            {document.notes && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Notes</span>
                <p className="text-slate-600 leading-relaxed">{document.notes}</p>
              </div>
            )}
            {document.type === 'invoice' && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs print:break-inside-avoid space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Bank transfer details (PKR)
              </p>
              <p className="font-bold text-slate-800">OMNYSYNC Technologies</p>
              <p className="text-slate-600">Bank: Habib Bank Limited (HBL) · Account: 1231-7901234567-01</p>
              <p className="text-slate-600">IBAN: PK00 HABB 0012 3179 0123 4567 · SWIFT: HABBPKKA</p>
              <p className="text-slate-500">Email remittance advice to billing@omnysync.com</p>
            </div>
          )}

          {document.terms && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Terms & Conditions
                </span>
                <p className="text-slate-600 leading-relaxed">{document.terms}</p>
              </div>
            )}
          </div>

          {/* E-Signature Box */}
          {document.signature ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between mt-6 print:break-inside-avoid">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Digitally E-Signed & Verified</h4>
                  <p className="text-[11px] text-emerald-700">
                    Signer: <span className="font-bold">{document.signature.signerName}</span> (
                    {document.signature.signerTitle})
                  </p>
                  <p className="text-[10px] text-emerald-600">
                    Timestamp: {new Date(document.signature.signedAt).toLocaleString()} | IP:{' '}
                    {document.signature.ipAddress}
                  </p>
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          ) : (
            <div className="pt-8 grid grid-cols-2 gap-8 print:break-inside-avoid">
              <div className="border-t border-slate-300 pt-2 text-center text-xs text-slate-500 space-y-1">
                <p className="font-bold text-slate-800">Authorized OmnySync Signature</p>
                <p className="text-[10px] text-slate-400">Computer Generated Document</p>
              </div>
              <div className="border-t border-slate-300 pt-2 text-center text-xs text-slate-500 space-y-1">
                <p className="font-bold text-slate-800">Client Acceptance Signature</p>
                <p className="text-[10px] text-slate-400">Date & Company Stamp</p>
              </div>
            </div>
          )}
        </main>

        {/* Footer Component */}
        <LetterheadFooter pageNumber={1} totalPages={1} />
      </div>
    </div>
  );
}
