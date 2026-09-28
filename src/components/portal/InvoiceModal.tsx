'use client';

import React, { useState } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import {
  Download,
  CreditCard,
  CheckCircle2,
  Receipt,
  Clock,
} from 'lucide-react';
import { ClientInvoice, ClientProfile } from '@/data/portalData';

interface InvoiceModalProps {
  invoice: ClientInvoice | null;
  profile: ClientProfile;
  isOpen: boolean;
  onClose: () => void;
  onPayInvoice: (invoiceId: string) => void;
}

export default function InvoiceModal({
  invoice,
  profile,
  isOpen,
  onClose,
  onPayInvoice,
}: InvoiceModalProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!invoice) return null;

  const isPaid = invoice.status === 'Paid';
  const isOverdue = invoice.status === 'Overdue';

  const handleTriggerPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      onPayInvoice(invoice.id);
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 2000);
    }, 1200);
  };

  const handleDownloadPDF = () => {
    const content = `
=====================================================
                 OMNYSYNC ERP INVOICE
=====================================================
Invoice #:    ${invoice.invoiceNumber}
Issue Date:   ${invoice.issueDate}
Due Date:     ${invoice.dueDate}
Status:       ${invoice.status}

BILLED TO:
${profile.name} (${profile.company})
Account: ${profile.accountNumber}

ITEMS:
${invoice.items.map((it) => `- ${it.description} (x${it.quantity}): $${it.total.toFixed(2)}`).join('\n')}

-----------------------------------------------------
TOTAL DUE:    $${invoice.amount.toFixed(2)} ${profile.currency}
=====================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}_Official_Receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-2xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/30 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{invoice.invoiceNumber}</h3>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                  isPaid
                    ? 'bg-[#b8ff00]/15 text-[#b8ff00] border-[#b8ff00]/30'
                    : isOverdue
                    ? 'bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/30'
                    : 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30'
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-xs text-[#9ca3af]">{invoice.description}</p>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141f19] hover:bg-[#1a2921] border border-[#22352a] text-xs font-semibold text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#2dd4bf]" />
            <span>Download Invoice</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#141a16] hover:bg-[#1c2420] text-xs font-semibold text-[#9ca3af] hover:text-white transition-colors"
            >
              Close
            </button>

            {!isPaid && (
              <button
                onClick={handleTriggerPayment}
                disabled={isProcessingPayment || paymentSuccess}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#b8ff00] hover:bg-[#a5e600] disabled:bg-[#4a5f1a] text-black font-bold text-xs shadow-lg shadow-[#b8ff00]/20 transition-all hover:scale-105"
              >
                {isProcessingPayment ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : paymentSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                    <span>Confirmed!</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay ${invoice.amount.toLocaleString()}</span>
                  </>
                )}
              </button>
            )}

            {isPaid && (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2dd4bf]/15 border border-[#2dd4bf]/30 text-[#2dd4bf] text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settled in Full</span>
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-xs text-[#d1d5db]">
        {/* Metadata Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#121a15] p-3.5 rounded-xl border border-[#1b2a21] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider block">
              Issued By
            </span>
            <p className="font-bold text-white text-xs">Omnysync Technologies, Inc.</p>
            <p className="text-[#9ca3af] text-[11px]">Enterprise Cloud Solutions</p>
            <p className="text-[#6b7280] text-[11px]">billing@omnysync.io</p>
          </div>

          <div className="bg-[#121a15] p-3.5 rounded-xl border border-[#1b2a21] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider block">
              Billed To
            </span>
            <p className="font-bold text-white text-xs">{profile.company}</p>
            <p className="text-[#9ca3af] text-[11px]">Attn: {profile.name}</p>
            <p className="text-[#6b7280] text-[11px]">{profile.email} • {profile.accountNumber}</p>
          </div>
        </div>

        {/* Dates & Payment Details */}
        <div className="grid grid-cols-3 gap-2 bg-[#111814] p-3 rounded-xl border border-[#1a261f]">
          <div>
            <span className="text-[10px] text-[#6b7280] block">Issue Date</span>
            <span className="font-semibold text-white text-[11px]">{invoice.issueDate}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#6b7280] block">Due Date</span>
            <span className={`font-semibold text-[11px] ${isOverdue ? 'text-[#f43f5e]' : 'text-white'}`}>
              {invoice.dueDate}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#6b7280] block">Payment Method</span>
            <span className="font-semibold text-[#2dd4bf] text-[11px]">
              {invoice.paymentMethod || 'ACH Wire / Card'}
            </span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-[#1b2a21] rounded-xl overflow-hidden">
          <div className="bg-[#141f19] px-4 py-2.5 font-bold text-[#9ca3af] grid grid-cols-12 text-[10px] uppercase tracking-wider">
            <div className="col-span-7">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-3 text-right">Total</div>
          </div>

          <div className="divide-y divide-[#17231c] bg-[#101713]">
            {invoice.items.map((item, idx) => (
              <div key={idx} className="px-4 py-3 grid grid-cols-12 items-center text-xs">
                <div className="col-span-7">
                  <p className="font-semibold text-white">{item.description}</p>
                  <span className="text-[10px] text-[#6b7280]">
                    @ ${item.unitPrice.toFixed(2)}
                  </span>
                </div>
                <div className="col-span-2 text-center text-[#9ca3af]">{item.quantity}</div>
                <div className="col-span-3 text-right font-bold text-white">
                  ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="bg-[#131d17] p-4 border-t border-[#1b2a21] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#9ca3af]">
              <span>Subtotal</span>
              <span className="text-white">${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-[#9ca3af]">
              <span>Sales Tax / VAT</span>
              <span className="text-white">$0.00</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1a2720]">
              <span>Total Due</span>
              <span className="text-[#2dd4bf] text-base font-black">
                ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {profile.currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}
