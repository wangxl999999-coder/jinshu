const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  const { search } = req.query;
  let query = `
    SELECT m.*, 
           (SELECT price FROM metal_prices WHERE metal_id = m.id ORDER BY fetch_time DESC LIMIT 1) as current_price,
           (SELECT change FROM metal_prices WHERE metal_id = m.id ORDER BY fetch_time DESC LIMIT 1) as price_change,
           (SELECT change_percent FROM metal_prices WHERE metal_id = m.id ORDER BY fetch_time DESC LIMIT 1) as change_percent,
           (SELECT fetch_time FROM metal_prices WHERE metal_id = m.id ORDER BY fetch_time DESC LIMIT 1) as fetch_time
    FROM metals m
  `;
  let params = [];

  if (search) {
    query += ` WHERE m.name LIKE ? OR m.code LIKE ?`;
    params = [`%${search}%`, `%${search}%`];
  }

  db.all(query, params, (err, metals) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(metals);
  });
});

router.get('/:code', (req, res) => {
  const { code } = req.params;

  db.get(`SELECT * FROM metals WHERE code = ?`, [code], (err, metal) => {
    if (err || !metal) {
      return res.status(404).json({ error: '金属不存在' });
    }

    const { startDate, endDate } = req.query;
    let priceQuery = `SELECT * FROM metal_prices WHERE metal_id = ?`;
    let params = [metal.id];

    if (startDate && endDate) {
      priceQuery += ` AND DATE(fetch_time) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else {
      priceQuery += ` AND fetch_time >= datetime('now', '-7 days')`;
    }
    priceQuery += ` ORDER BY fetch_time ASC`;

    db.all(priceQuery, params, (err, prices) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ metal, prices });
    });
  });
});

module.exports = router;
