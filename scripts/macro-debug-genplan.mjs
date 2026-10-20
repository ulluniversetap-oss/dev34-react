import { writeFile } from 'node:fs/promises';

const API = 'https://api.macro.sbercrm.com/v2';
const token = process.env.MACRO_API_KEY;
if (!token) throw new Error('MACRO_API_KEY is not set');

async function call(method, body = {}) {
  const res = await fetch(`${API}${method}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} -> ${res.status}: ${text}`);
  return JSON.parse(text);
}

const complexId = 4198566; // bereg-volgi-1

const out = {};
out.complexGet = await call('/estateComplexes/get', { id: complexId }).catch((e) => ({ error: String(e) }));
out.housesList = await call('/estateHouses/list', { complexIds: [complexId] }).catch((e) => ({ error: String(e) }));

await writeFile(new URL('../macro-genplan-debug.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2).slice(0, 8000));
