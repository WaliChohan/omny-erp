'use client';

import { useState, useEffect } from 'react';

export default function useDetectBrowser(): string {
  const [browser, setBrowser] = useState<string>('Unknown');

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
      setBrowser('Safari');
    } else if (userAgent.indexOf('Chrome') > -1) {
      setBrowser('Chrome');
    } else if (userAgent.indexOf('Firefox') > -1) {
      setBrowser('Firefox');
    } else if (userAgent.indexOf('Edge') > -1) {
      setBrowser('Edge');
    } else {
      setBrowser('Other');
    }
  }, []);

  return browser;
}
