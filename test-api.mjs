import http from 'http';

const data = JSON.stringify({
  topic: 'Photosynthesis',
  additionalRequirements: 'test'
});

const req = http.request(
  'http://localhost:3000/api/explain',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  },
  (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
  }
);

req.on('error', console.error);
req.write(data);
req.end();
