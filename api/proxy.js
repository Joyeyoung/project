const fetch = require('node-fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 쿼리스트링 파싱
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const params = urlObj.searchParams.toString();
  const url = `https://apis.data.go.kr/1421000/mssBizService_v2/getMssBizList?${params}`;

  try {
    const apiRes = await fetch(url);
    const data = await apiRes.text();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).json({ error: 'API fetch failed', detail: e.message });
  }
}; 