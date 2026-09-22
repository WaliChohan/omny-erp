'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ERPDocument, DocumentStatus, DocumentType } from '@/types/documentEngine';
import { INITIAL_DOCUMENTS } from '@/data/mockDocuments';

interface DocumentContextType {
  documents: ERPDocument[];
  activeDocument: ERPDocument | null;
  setActiveDocument: (doc: ERPDocument | null) => void;
  createDocument: (doc: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => ERPDocument;
  updateDocument: (id: string, updates: Partial<ERPDocument>) => void;
  deleteDocument: (id: string) => void;
  updateDocumentStatus: (id: string, status: DocumentStatus) => void;
  duplicateDocument: (id: string) => ERPDocument;
  convertDocument: (id: string, targetType: DocumentType) => ERPDocument;
  addSignatureToDocument: (id: string, signerName: string, signerTitle: string, signerEmail: string, signatureDataUrl?: string) => void;
}

const STORAGE_KEY = 'omnysync_erp_documents_v1';

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<ERPDocument[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to load documents from localStorage:', e);
      }
    }
    return INITIAL_DOCUMENTS;
  });

  const [activeDocument, setActiveDocument] = useState<ERPDocument | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to save documents to localStorage:', e);
    }
  }, [documents]);

  const createDocument = useCallback(
    (docData: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt' | 'version'>): ERPDocument => {
      const newDoc: ERPDocument = {
        ...docData,
        id: `doc-${Date.now()}`,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDocuments((prev) => [newDoc, ...prev]);
      return newDoc;
    },
    []
  );

  const updateDocument = useCallback((id: string, updates: Partial<ERPDocument>) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, ...updates, updatedAt: new Date().toISOString() }
          : doc
      )
    );
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateDocumentStatus = useCallback((id: string, status: DocumentStatus) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, status, updatedAt: new Date().toISOString() }
          : doc
      )
    );
  }, []);

  const duplicateDocument = useCallback(
    (id: string): ERPDocument => {
      const original = documents.find((d) => d.id === id);
      if (!original) throw new Error('Original document not found');

      const prefixMap: Record<DocumentType, string> = {
        invoice: 'INV',
        receipt: 'REC',
        quotation: 'QT',
        proposal: 'PROP',
      };
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newDocNumber = `${prefixMap[original.type]}-2026-${randomNum}`;

      const duplicatedDoc: ERPDocument = {
        ...original,
        id: `doc-${Date.now()}`,
        docNumber: newDocNumber,
        status: 'draft',
        version: 1,
        parentDocumentId: original.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocuments((prev) => [duplicatedDoc, ...prev]);
      return duplicatedDoc;
    },
    [documents]
  );

  const convertDocument = useCallback(
    (id: string, targetType: DocumentType): ERPDocument => {
      const source = documents.find((d) => d.id === id);
      if (!source) throw new Error('Source document not found');

      const prefixMap: Record<DocumentType, string> = {
        invoice: 'INV',
        receipt: 'REC',
        quotation: 'QT',
        proposal: 'PROP',
      };
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newDocNumber = `${prefixMap[targetType]}-2026-${randomNum}`;

      const convertedDoc: ERPDocument = {
        ...source,
        id: `doc-${Date.now()}`,
        docNumber: newDocNumber,
        type: targetType,
        status: targetType === 'receipt' ? 'paid' : 'draft',
        convertedFromType: source.type,
        parentDocumentId: source.id,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocuments((prev) => [convertedDoc, ...prev]);
      return convertedDoc;
    },
    [documents]
  );

  const addSignatureToDocument = useCallback(
    (
      id: string,
      signerName: string,
      signerTitle: string,
      signerEmail: string,
      signatureDataUrl?: string
    ) => {
      const signatureObj = {
        id: `sig-${Date.now()}`,
        signerName,
        signerTitle,
        signerEmail,
        signatureDataUrl,
        signedAt: new Date().toISOString(),
        ipAddress: '127.0.0.1 (Verified)',
      };

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                signature: signatureObj,
                status: 'accepted',
                updatedAt: new Date().toISOString(),
              }
            : doc
        )
      );
    },
    []
  );

  return (
    <DocumentContext.Provider
      value={{
        documents,
        activeDocument,
        setActiveDocument,
        createDocument,
        updateDocument,
        deleteDocument,
        updateDocumentStatus,
        duplicateDocument,
        convertDocument,
        addSignatureToDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocumentStore() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentStore must be used within a DocumentProvider');
  }
  return context;
}
