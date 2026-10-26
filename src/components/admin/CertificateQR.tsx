import React, { useMemo } from 'react';
import { qrcodegen } from '../../vendor/qrcodegen';

/** Offline, locally generated QR. Never send student certificate codes to third-party QR services. */
export const certificateVerificationUrl = (code: string): string => {
  // HashRouter is used by this app; preserve installation sub-path.
  const root = new URL(import.meta.env.BASE_URL, window.location.origin + window.location.pathname);
  return new URL(root.pathname + '#/validar-certificado/' + encodeURIComponent(code), root.origin).toString();
};

interface CertificateQRProps {
  code: string | null | undefined;
  size?: number;
}
export const CertificateQR: React.FC<CertificateQRProps> = ({ code, size = 102 }) => {
  const qr = useMemo(() => {
    if (!code || !/^USM-[A-F0-9]{32}$/.test(code)) return null;
    try {
      const value = certificateVerificationUrl(code);
      const matrix = qrcodegen.QrCode.encodeText(value, qrcodegen.QrCode.Ecc.MEDIUM);
      const cells: string[] = [];
      for (let y = 0; y < matrix.size; y++) {
        for (let x = 0; x < matrix.size; x++) {
          if (matrix.getModule(x, y)) cells.push(`M${x + 4},${y + 4}h1v1h-1z`);
        }
      }
      return { size: matrix.size + 8, path: cells.join('') };
    } catch {
      return null;
    }
  }, [code]);

  if (!qr) return <span className="text-[9px] font-bold text-amber-300">PRÉVIA — NÃO EMITIDO</span>;
  return <svg role="img" aria-label="QR Code para conferir autenticidade do certificado" width={size} height={size}
    viewBox={`0 0 ${qr.size} ${qr.size}`} xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 rounded p-1 bg-white">
    <rect width={qr.size} height={qr.size} fill="#fff"/>
    <path d={qr.path} fill="#000"/>
  </svg>;
};
