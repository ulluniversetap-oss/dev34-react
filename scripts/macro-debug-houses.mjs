import { writeFile } from 'node:fs/promises';

const API = 'https://api.macro.sbercrm.com/v2';
const token = process.env.MACRO_API_KEY;
if (!token) throw new Error('MACRO_API_KEY is not set');

const describe = (e) => ({ error: String(e) });

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
out.housesList = await call('/estateHouses/list', { complexIds: [complexId] }).catch(describe);

await writeFile(new URL('../macro-houses-debug.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2).slice(0, 6000));
