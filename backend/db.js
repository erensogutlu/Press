const { Pool } = require('pg');
require('dotenv').config();

// veritabanı bağlantı havuzu oluşturma
const havuz = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  sorgu: (metin, parametreler) => havuz.query(metin, parametreler),
  havuz
};
