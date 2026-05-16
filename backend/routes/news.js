const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.all(`SELECT * FROM news ORDER BY publish_time DESC LIMIT ? OFFSET ?`, 
    [parseInt(limit), parseInt(offset)], 
    (err, news) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      db.get(`SELECT COUNT(*) as total FROM news`, (err, result) => {
        res.json({ news, total: result.total, page: parseInt(page), limit: parseInt(limit) });
      });
    }
  );
});

router.get('/:id', (req, res) => {
  db.get(`SELECT * FROM news WHERE id = ?`, [req.params.id], (err, news) => {
    if (err || !news) {
      return res.status(404).json({ error: '新闻不存在' });
    }
    res.json(news);
  });
});

module.exports = router;
