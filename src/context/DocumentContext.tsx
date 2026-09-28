'use client';

import React from 'react';
import { useAgency } from '@/context/AgencyContext';
import { ERPDocument, DocumentStatus, DocumentType } from '@/types/documentEngine';

/**
 * Thin adapter — hub documents now live in AgencyContext.
 * Keeps DocumentManagerView / DocumentBuilderModal APIs stable.
 */
export function DocumentProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useDocumentStore() {
  const {
    hubDocuments,
    activeHubDocument,
    setActiveHubDocument,
    createHubDocument,
    updateHubDocument,
    deleteHubDocument,
    updateHubDocumentStatus,
    duplicateHubDocument,
    convertHubDocument,
    addSignatureToHubDocument,
  } = useAgency();

  return {
    documents: hubDocuments,
    activeDocument: activeHubDocument,
    setActiveDocument: setActiveHubDocument,
    createDocument: createHubDocument,
    updateDocument: updateHubDocument,
    deleteDocument: deleteHubDocument,
    updateDocumentStatus: updateHubDocumentStatus,
    duplicateDocument: duplicateHubDocument,
    convertDocument: convertHubDocument,
    addSignatureToDocument: addSignatureToHubDocument,
  } as {
    documents: ERPDocument[];
    activeDocument: ERPDocument | null;
    setActiveDocument: (doc: ERPDocument | null) => void;
    createDocument: (doc: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => ERPDocument;
    updateDocument: (id: string, updates: Partial<ERPDocument>) => void;
    deleteDocument: (id: string) => void;
    updateDocumentStatus: (id: string, status: DocumentStatus) => void;
    duplicateDocument: (id: string) => ERPDocument;
    convertDocument: (id: string, targetType: DocumentType) => ERPDocument;
    addSignatureToDocument: (
      id: string,
      signerName: string,
      signerTitle: string,
      signerEmail: string,
      signatureDataUrl?: string
    ) => void;
  };
}
