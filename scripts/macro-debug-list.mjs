// Разовый диагностический скрипт: печатает ID/названия/адреса ЖК из MacroAPI,
// чтобы сопоставить их со slug'ами в src/data/zhk.ts. Не предназначен для
// постоянного использования — только чтобы один раз увидеть реальные ID.
const API = 'https://api.macroserver.ru';
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

const complexes = await call('/estateComplexes/list');
console.log(`Found ${complexes.data.length} complexes:\n`);
for (const c of complexes.data) {
  console.log(JSON.stringify(c));
}

const stats = await call('/estateComplexes/listStats');
console.log('\nStats:\n', JSON.stringify(stats.data, null, 1));
