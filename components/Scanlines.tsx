import React from 'react';

export const Scanlines = () => (
  <style>{`
    @keyframes scanline {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(100%);
      }
    }
    .background-scanlines {
      background: linear-gradient(
        to bottom,
        rgba(255,255,255,0),
        rgba(255,255,255,0) 50%,
        rgba(0,0,0,0.2) 50%,
        rgba(0,0,0,0.2)
      );
      background-size: 100% 4px;
      animation: scanline 10s linear infinite;
    }
    .animate-spin-slow {
        animation: spin 8s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
  `}</style>
);