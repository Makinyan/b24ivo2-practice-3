import http from 'k6/http';
import { check, sleep } from 'k6';

// SLO configuration
export const options = {
  thresholds: {
    http_req_failed: ['rate<=0.001'],   // ≤ 0.1% ошибок
    http_req_duration: ['p(95)<=200'],  // p95 ≤ 200 ms
  },
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m',  target: 50 },
    { duration: '2m',  target: 100 },
    { duration: '1m',  target: 0 },
  ],
};

const BASE = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  // Главная страница
  const res = http.get(`${BASE}/`);
  check(res, {
    'main page status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // Healthcheck
  const health = http.get(`${BASE}/health`);
  check(health, {
    'health status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
