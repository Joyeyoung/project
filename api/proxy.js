const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { query } = req;
  const params = new URLSearchParams(query).toString();
  const url = `https://apis.data.go.kr/1421000/mssBizService_v2/getMssBizList?${params}`;

  try {
    const apiRes = await fetch(url);
    const data = await apiRes.text();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).json({ error: 'API fetch failed', detail: e.message });
  }
} 