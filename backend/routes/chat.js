const express = require('express');
const db = require('../database');

const router = express.Router();

router.post('/session', (req, res) => {
  const { userId } = req.body;
  const sessionCode = 'CHAT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);

  db.run(`INSERT INTO chat_sessions (user_id, session_code) VALUES (?, ?)`,
    [userId || null, sessionCode],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ sessionId: this.lastID, sessionCode });
    }
  );
});

router.get('/session/:code/messages', (req, res) => {
  db.all(`
    SELECT * FROM chat_messages
    WHERE session_id = (SELECT id FROM chat_sessions WHERE session_code = ?)
    ORDER BY created_at ASC
  `, [req.params.code], (err, messages) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(messages);
  });
});

router.post('/session/:code/messages', (req, res) => {
  const { senderType, content } = req.body;

  db.get(`SELECT id FROM chat_sessions WHERE session_code = ?`, [req.params.code], (err, session) => {
    if (err || !session) {
      return res.status(404).json({ error: '会话不存在' });
    }

    db.run(`INSERT INTO chat_messages (session_id, sender_type, content) VALUES (?, ?, ?)`,
      [session.id, senderType, content],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
      }
    );
  });
});

module.exports = router;
