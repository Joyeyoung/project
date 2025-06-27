const fetch = require('node-fetch');
const xml2js = require('xml2js');

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

  // 엔드포인트를 getbizList_v2로 변경
  const apiUrl = 'https://apis.data.go.kr/1421000/mssBizService_v2/getbizList_v2';

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
    // XML을 JSON으로 변환
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(data, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'XML parsing failed', detail: err.message });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'API fetch failed', detail: e.message });
  }
};
// xml2js가 설치되어 있지 않으면, npm install xml2js 명령어로 설치하세요. 