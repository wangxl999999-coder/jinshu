const express = require('express');
const { authenticateToken } = require('./auth');
const db = require('../database');

const router = express.Router();

router.use(authenticateToken);

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
}

router.get('/users', isAdmin, (req, res) => {
  db.all(`SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`, (err, users) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(users);
  });
});

router.delete('/users/:id', isAdmin, (req, res) => {
  db.run(`DELETE FROM users WHERE id = ? AND role != 'admin'`, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: '删除成功' });
  });
});

router.get('/sessions', isAdmin, (req, res) => {
  db.all(`
    SELECT cs.*, u.username
    FROM chat_sessions cs
    LEFT JOIN users u ON cs.user_id = u.id
    ORDER BY cs.created_at DESC
  `, (err, sessions) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(sessions);
  });
});

router.put('/sessions/:id/lead', isAdmin, (req, res) => {
  const { is_valid_lead } = req.body;
  db.run(`UPDATE chat_sessions SET is_valid_lead = ? WHERE id = ?`, 
    [is_valid_lead ? 1 : 0, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: '更新成功' });
  });
});

router.get('/inquiries', isAdmin, (req, res) => {
  db.all(`
    SELECT i.*, u.username, m.name as metal_name
    FROM inquiries i
    LEFT JOIN users u ON i.user_id = u.id
    LEFT JOIN metals m ON i.metal_id = m.id
    ORDER BY i.created_at DESC
  `, (err, inquiries) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(inquiries);
  });
});

router.post('/news', isAdmin, (req, res) => {
  const { title, content, source } = req.body;
  db.run(`INSERT INTO news (title, content, source, publish_time) VALUES (?, ?, ?, datetime('now'))`,
    [title, content, source], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: '发布成功' });
    }
  );
});

module.exports = router;
