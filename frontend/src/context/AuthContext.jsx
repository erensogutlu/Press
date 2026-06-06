import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const saklananKullanici = localStorage.getItem('kullanici');
    const token = localStorage.getItem('token');
    if (saklananKullanici && token) {
      setKullanici(JSON.parse(saklananKullanici));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setYukleniyor(false);
  }, []);

  const giris = (veri) => {
    setKullanici(veri.kullanici);
    localStorage.setItem('token', veri.token);
    localStorage.setItem('kullanici', JSON.stringify(veri.kullanici));
    axios.defaults.headers.common['Authorization'] = `Bearer ${veri.token}`;
  };

  const cikis = () => {
    setKullanici(null);
    localStorage.removeItem('token');
    localStorage.removeItem('kullanici');
    delete axios.defaults.headers.common['Authorization'];
    // sayfayı tamamen yenile ve giriş sayfasına at
    window.location.href = '/giris';
  };

  return (
    <AuthContext.Provider value={{ kullanici, giris, cikis, yukleniyor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
