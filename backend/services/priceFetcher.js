const cron = require('node-cron');
const axios = require('axios');
const db = require('../database');
const emailService = require('./emailService');

const mockPrices = {
  gold: { base: 480, volatility: 5 },
  silver: { base: 5.8, volatility: 0.2 },
  copper: { base: 68000, volatility: 500 },
  iron: { base: 3800, volatility: 50 },
  aluminum: { base: 18500, volatility: 200 },
  zinc: { base: 21000, volatility: 300 },
  nickel: { base: 180000, volatility: 2000 },
  tin: { base: 210000, volatility: 2000 }
};

async function fetchPrices() {
  console.log('开始抓取金属价格...');

  db.all(`SELECT id, code FROM metals`, [], (err, metals) => {
    if (err) {
      console.error('获取金属列表失败:', err);
      return;
    }

    metals.forEach(metal => {
      const config = mockPrices[metal.code];
      if (!config) return;

      const change = (Math.random() - 0.5) * config.volatility * 2;
      const newPrice = config.base + change;
      const changePercent = (change / config.base) * 100;

      db.run(`INSERT INTO metal_prices (metal_id, price, change, change_percent) VALUES (?, ?, ?, ?)`,
        [metal.id, newPrice, change, changePercent],
        function(err) {
          if (err) {
            console.error('保存价格失败:', err);
            return;
          }
          console.log(`${metal.code} 价格更新: ${newPrice}`);
          checkPriceAlerts(metal.id, newPrice);
        }
      );
    });
  });
}

function checkPriceAlerts(metalId, newPrice) {
  db.all(`
    SELECT uf.*, u.email, u.username, m.name as metal_name
    FROM user_favorites uf
    JOIN users u ON uf.user_id = u.id
    JOIN metals m ON uf.metal_id = m.id
    WHERE uf.metal_id = ?
  `, [metalId], (err, favorites) => {
    if (err) return;

    favorites.forEach(favorite => {
      if (favorite.threshold && Math.abs(newPrice - favorite.threshold) < 10) {
        emailService.sendPriceAlert(favorite.email, favorite.username, favorite.metal_name, newPrice);
      }
    });
  });
}

function start() {
  fetchPrices();
  cron.schedule('0 */1 * * *', () => {
    fetchPrices();
  });
  console.log('价格抓取定时任务已启动');
}

module.exports = { start, fetchPrices };
