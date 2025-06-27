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
  const params = urlObj.searchParams;

  // 엔드포인트를 mssBizService_v2로 변경
  const apiUrl = 'https://apis.data.go.kr/1421000/mssBizService_v2/getMssBizList';

  const serviceKey = process.env.serviceKey;
  // 필수 파라미터: serviceKey, pageNo, numOfRows
  // 선택 파라미터: startDate, endDate
  const searchParams = new URLSearchParams();
  searchParams.append('serviceKey', serviceKey);
  searchParams.append('returnType', 'XML');
  if (params.get('pageNo')) searchParams.append('pageNo', params.get('pageNo'));
  if (params.get('numOfRows')) searchParams.append('numOfRows', params.get('numOfRows'));
  if (params.get('startDate')) searchParams.append('startDate', params.get('startDate'));
  if (params.get('endDate')) searchParams.append('endDate', params.get('endDate'));

  const url = `${apiUrl}?${searchParams.toString()}`;

  try {
    const apiRes = await fetch(url);
    const data = await apiRes.text();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).json({ error: 'API fetch failed', detail: e.message });
  }
}; 