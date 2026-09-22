export type DocumentType = 'invoice' | 'receipt' | 'quotation' | 'proposal';

export type DocumentSubtype = 'standard' | 'recurring' | 'tax' | 'payment_voucher';

export type DocumentStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface DocumentItem {
  id: string;
  itemType: 'product' | 'service' | 'rental' | 'import_po';
  skuOrCode: string;
  description: string;
  warehouseId?: string;
  warehouseName?: string;
  quantity: number;
  unitName: string;
  unitPrice: number;
  taxRate: number;
  discount: number;
  totalPrice: number;
}

export interface ProposalSection {
  id: string;
  sectionNumber: string;
  title: string;
  content: string;
  bulletPoints?: string[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  calloutBox?: {
    title: string;
    text: string;
  };
}

export interface DocumentSignature {
  id: string;
  signerName: string;
  signerTitle: string;
  signerEmail: string;
  signatureDataUrl?: string;
  signedAt: string;
  ipAddress?: string;
}

export interface ERPDocument {
  id: string;
  docNumber: string;
  type: DocumentType;
  subtype: DocumentSubtype;
  status: DocumentStatus;
  
  // Client Info
  clientId?: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientTaxId?: string;
  
  // Dates & Currency
  issueDate: string;
  dueDate: string;
  currency: 'USD' | 'PKR' | 'GBP' | 'EUR';
  exchangeRate?: number;
  
  // Amounts
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;

  // Custom Fields
  notes?: string;
  terms?: string;
  
  // Multi-section Proposal content
  proposalHeadline?: string;
  proposalSubhead?: string;
  sections?: ProposalSection[];
  
  // Items & Signature
  items: DocumentItem[];
  signature?: DocumentSignature;
  
  // Versioning & Conversion Lineage
  version: number;
  parentDocumentId?: string;
  convertedFromType?: DocumentType;
  
  createdAt: string;
  updatedAt: string;
}
