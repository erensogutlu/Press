import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PiyasaBandi = () => {
  const [piyasa, setPiyasa] = useState([
    { isim: 'USD/TRY', deger: 32.45, degisim: 0.12 },
    { isim: 'EUR/TRY', deger: 35.12, degisim: -0.05 },
    { isim: 'ALTIN', deger: 2450.40, degisim: 0.45 },
    { isim: 'BIST 100', deger: 9850, degisim: 1.20 },
    { isim: 'BTC/USD', deger: 64200, degisim: -1.10 }
  ]);

  useEffect(() => {
    const zamanlayici = setInterval(() => {
      setPiyasa(prev => prev.map(item => ({
        ...item,
        deger: item.deger + (Math.random() - 0.5) * (item.deger * 0.001),
        degisim: item.degisim + (Math.random() - 0.5) * 0.1
      })));
    }, 3000);
    return () => clearInterval(zamanlayici);
  }, []);

  return (
    <div className="glass" style={{ 
      padding: '0.75rem 0', 
      borderTop: 'none', 
      borderLeft: 'none', 
      borderRight: 'none',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'kayma 40s linear infinite', width: 'max-content' }}>
        {[...piyasa, ...piyasa, ...piyasa, ...piyasa].map((item, i) => (
          <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 2rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>{item.isim}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.deger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              color: item.degisim >= 0 ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              {item.degisim >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              %{Math.abs(item.degisim).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes kayma {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default PiyasaBandi;
