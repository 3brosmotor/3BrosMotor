'use client';

import { useEffect } from 'react';

export default function ClientErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      const reason = event.reason;
      
      const msg = typeof reason?.message === 'string' ? reason.message.toLowerCase() : '';
      const name = typeof reason?.name === 'string' ? reason.name.toLowerCase() : '';
      const str = typeof reason === 'string' ? reason.toLowerCase() : '';

      // Check if error is an AbortError, stream abort, network/fetch glitch, or pending Firestore permission
      const isIgnorable = 
        name === 'aborterror' ||
        reason?.code === 20 ||
        reason?.code === 'permission-denied' ||
        reason?.code === 'unavailable' ||
        msg.includes('abort') ||
        msg.includes('the user aborted a request') ||
        msg.includes('fetch is aborted') ||
        msg.includes('failed to fetch') ||
        msg.includes('network error') ||
        msg.includes('networkrequestfailed') ||
        msg.includes('load failed') ||
        msg.includes('insufficient permissions') ||
        msg.includes('missing or insufficient permissions') ||
        str.includes('failed to fetch') ||
        str.includes('abort');

      if (isIgnorable) {
        // Prevent default browser/Next.js overlay from crashing on harmless fetch/network aborts or offline states
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleError = (event) => {
      const msg = typeof event?.message === 'string' ? event.message.toLowerCase() : '';
      const errorMsg = typeof event?.error?.message === 'string' ? event.error.message.toLowerCase() : '';

      const isIgnorable =
        msg.includes('failed to fetch') ||
        msg.includes('network error') ||
        msg.includes('aborterror') ||
        msg.includes('abort') ||
        msg.includes('resizeobserver') ||
        errorMsg.includes('failed to fetch') ||
        errorMsg.includes('network error') ||
        errorMsg.includes('permission-denied');

      if (isIgnorable) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    window.addEventListener('error', handleError, true);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return null;
}

