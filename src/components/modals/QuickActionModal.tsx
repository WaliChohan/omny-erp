'use client';

import React, { useState } from 'react';
import { X, CheckCircle, ShoppingCart, Receipt, PackagePlus, ClipboardList } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  actionType: string;
  onClose: () => void;
}

export default function QuickActionModal({
  isOpen,
  actionType,
  onClose,
}: QuickActionModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    customerOrVendor: '',
    category: 'Standard',
  });

  if (!isOpen) return null;

  const getActionConfig = () => {
    switch (actionType) {
      case 'new_sale':
        return {
          title: 'New Sale Order',
          description: 'Record a new sales transaction and update inventory.',
          icon: ShoppingCart,
          targetLabel: 'Customer Name',
          amountLabel: 'Total Sale Amount ($)',
        };
      case 'create_invoice':
        return {
          title: 'Create Commercial Invoice',
          description: 'Generate an invoice for clients with automated tax calculations.',
          icon: Receipt,
          targetLabel: 'Client / Company',
          amountLabel: 'Invoice Amount ($)',
        };
      case 'add_product':
        return {
          title: 'Add New Product',
          description: 'Register a product in warehouse inventory with SKU tracking.',
          icon: PackagePlus,
          targetLabel: 'Product Name',
          amountLabel: 'Unit Price ($)',
        };
      case 'new_po':
        return {
          title: 'New Purchase Order (PO)',
          description: 'Send purchase order to registered suppliers.',
          icon: ClipboardList,
          targetLabel: 'Supplier / Vendor',
          amountLabel: 'Estimated PO Amount ($)',
        };
      default:
        return {
          title: 'ERP Action',
          description: 'Perform ERP command center action.',
          icon: ShoppingCart,
          targetLabel: 'Entity Name',
          amountLabel: 'Amount ($)',
        };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#121815] border border-[#223328] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9ca3af] hover:text-white p-1 rounded-lg hover:bg-[#1a2620] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#172c20] border border-[#224833] flex items-center justify-center text-[#00e676]">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{config.title}</h3>
            <p className="text-xs text-[#9ca3af] mt-0.5">{config.description}</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-12 h-12 text-[#00e676] mb-3 animate-bounce" />
            <p className="text-sm font-semibold text-white">Action Completed Successfully!</p>
            <p className="text-xs text-[#9ca3af] mt-1">FlowERP database has been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#d1d5db] font-medium mb-1.5">{config.targetLabel}</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Corp, John Doe, Wireless Tech..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#16201b] border border-[#223328] focus:border-[#00e676] rounded-lg px-3.5 py-2.5 text-white outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#d1d5db] font-medium mb-1.5">{config.amountLabel}</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-[#16201b] border border-[#223328] focus:border-[#00e676] rounded-lg px-3.5 py-2.5 text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#d1d5db] font-medium mb-1.5">Priority / Type</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#16201b] border border-[#223328] focus:border-[#00e676] rounded-lg px-3.5 py-2.5 text-white outline-none transition-colors"
                >
                  <option value="Standard">Standard</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Contractual">Contractual (SOW)</option>
                  <option value="Legal">Legal Documentation</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#1a2620]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#16201b] border border-[#223328] text-[#9ca3af] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#00e676] hover:bg-[#00c853] text-[#052e16] font-bold shadow-md shadow-[#00e676]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Create Record
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
