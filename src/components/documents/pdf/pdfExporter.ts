'use client';

/**
 * High-fidelity Vector Print and PDF Export Utility for OmnySync Documents.
 * Opens clean print view with brand styling preserved.
 */
export function exportDocumentToPDF(documentTitle: string = 'OmnySync_Document') {
  if (typeof window === 'undefined') return;

  // Add temporary print title
  const originalTitle = window.document.title;
  window.document.title = documentTitle;

  // Trigger standard vector PDF print engine
  window.print();

  // Restore original title
  setTimeout(() => {
    window.document.title = originalTitle;
  }, 1000);
}
