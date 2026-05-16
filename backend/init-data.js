const db = require('./database');

const newsData = [
  {
    title: '国际金价突破2000美元大关，创历史新高',
    content: '受全球经济不确定性和地缘政治紧张局势影响，国际黄金价格持续上涨，突破2000美元/盎司关键心理关口。分析师认为，美联储加息预期放缓和避险需求增加是推动金价上涨的主要因素。',
    source: '金融时报',
    publish_time: new Date().toISOString()
  },
  {
    title: '铜价持续走高，新能源产业需求旺盛',
    content: '随着全球新能源汽车和可再生能源产业的快速发展，铜作为关键工业金属的需求量大幅增加。近期LME铜价已突破9000美元/吨，市场预期未来几年铜供应将面临紧张局面。',
    source: '有色金属网',
    publish_time: new Date(Date.now() - 86400000).toISOString()
  },
  {
    title: '铁矿石价格波动加剧，供需格局变化引关注',
    content: '受中国房地产政策调整和钢铁产能调控影响，铁矿石价格近期出现较大波动。主要矿业公司纷纷调整产能计划，市场对未来铁矿石供需格局存在分歧。',
    source: '矿业周刊',
    publish_time: new Date(Date.now() - 172800000).toISOString()
  },
  {
    title: '铝行业面临能源成本压力，企业寻求绿色转型',
    content: '电解铝作为高耗能产业，正面临全球能源价格上涨的巨大压力。众多铝企开始布局绿电铝项目，寻求低碳转型之路，以应对欧盟碳边境调节机制等政策挑战。',
    source: '能源观察',
    publish_time: new Date(Date.now() - 259200000).toISOString()
  },
  {
    title: '镍价受动力电池需求支撑，长期前景看好',
    content: '随着高镍三元电池在新能源汽车中的应用比例不断提升，镍的市场需求持续增长。业内预计，未来5年全球镍需求量将保持年均8%以上的增速。',
    source: '新能源汽车报',
    publish_time: new Date(Date.now() - 345600000).toISOString()
  }
];

const stmt = db.prepare('INSERT INTO news (title, content, source, publish_time) VALUES (?, ?, ?, ?)');
newsData.forEach(news => {
  stmt.run(news.title, news.content, news.source, news.publish_time);
});
stmt.finalize();

console.log('新闻数据初始化完成');
