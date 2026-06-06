import React from 'react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import axios from 'axios';

const PressMedya = () => {
  const [videolar, setVideolar] = React.useState([]);

  React.useEffect(() => {
    const medyayiGetir = async () => {
      try {
        const yanit = await axios.get('http://localhost:5000/api/medya');
        setVideolar(yanit.data);
      } catch (hata) {
        console.error('medya yüklenemedi:', hata);
      }
    };
    medyayiGetir();
  }, []);

  return (
    <div style={{ padding: '4rem 0', marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#ef4444', padding: '0.4rem', borderRadius: '8px', color: 'white' }}>
          <Film size={20} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>PRESS MEDYA</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {videolar.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ borderRadius: '24px', overflow: 'hidden', height: '220px', background: 'black', border: '1px solid var(--border)' }}>
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${video.video_id}`} 
                title={video.baslik}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', padding: '0 0.5rem' }}>{video.baslik}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PressMedya;
