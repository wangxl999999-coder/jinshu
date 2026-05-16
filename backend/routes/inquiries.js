const express = require('express');
const { authenticateToken } = require('./auth');
const db = require('../database');

const router = express.Router();

router.use(authenticateToken);

router.get('/', (req, res) => {
  db.all(`
    SELECT i.*, m.name as metal_name
    FROM inquiries i
    LEFT JOIN metals m ON i.metal_id = m.id
    WHERE i.user_id = ?
    ORDER BY i.created_at DESC
  `, [req.user.id], (err, inquiries) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(inquiries);
  });
});

router.post('/', (req, res) => {
  const { metalId, type, title, content, contact } = req.body;

  db.run(`INSERT INTO inquiries (user_id, metal_id, type, title, content, contact) VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, metalId, type, title, content, contact],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: '提交成功' });
    }
  );
});

module.exports = router;
