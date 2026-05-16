const express = require('express');
const { authenticateToken } = require('./auth');
const db = require('../database');

const router = express.Router();

router.use(authenticateToken);

router.get('/', (req, res) => {
  db.all(`
    SELECT uf.*, m.name, m.code, m.unit,
           (SELECT price FROM metal_prices WHERE metal_id = m.id ORDER BY fetch_time DESC LIMIT 1) as current_price
    FROM user_favorites uf
    JOIN metals m ON uf.metal_id = m.id
    WHERE uf.user_id = ?
  `, [req.user.id], (err, favorites) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(favorites);
  });
});

router.post('/', (req, res) => {
  const { metalId, threshold } = req.body;

  db.run(`INSERT OR REPLACE INTO user_favorites (user_id, metal_id, threshold) VALUES (?, ?, ?)`,
    [req.user.id, metalId, threshold],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: '关注成功' });
    }
  );
});

router.delete('/:metalId', (req, res) => {
  db.run(`DELETE FROM user_favorites WHERE user_id = ? AND metal_id = ?`,
    [req.user.id, req.params.metalId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: '取消关注成功' });
    }
  );
});

module.exports = router;
