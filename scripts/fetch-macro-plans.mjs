// Подтягивает актуальные коммерческие лоты из MacroCRM и генерирует
// src/data/macro-plans.generated.json — карту slug → { freeUnits, areaRange,
// priceFrom, plans }, которую src/data/zhk.ts подмешивает поверх статических
// данных (если файла нет — сайт просто работает на статике, без падения сборки).
import { writeFile } from 'node:fs/promises';

const API = 'https://api.macro.sbercrm.com/v2';
const token = process.env.MACRO_API_KEY;
if (!token) throw new Error('MACRO_API_KEY is not set');

// slug из src/data/zhk.ts → ID жилого комплекса в MacroCRM
const COMPLEX_MAP = {
  'geroi-pokoleniy-1': 4060387, // ЖК «Герои поколений» первая очередь
  'geroi-pokoleniy-2': 7043277, // ЖК «Герои поколений» вторая очередь
  'bereg-volgi-1': 4198566, // ЖК «Берег Волги»
  'tzr-new-1': 3810504, // ЖК Новый
  'matrosova-1': 4347959, // «ЖК на Матросова»
  'semeyniy-1': 3909442, // ЖК «Семейный»
  'severniy-1': 3909441, // ЖК «Северный»
  'gvardeyskaya-1': 3810503, // ЖК на 35 Гвардейской
};

// 20 Свободно, 30/32 Бронь (маркетинговый резерв) — остальное (проверка,
// сделки в работе/проведена) на сайт не показываем.
const STATUS_LABEL = { 20: 'Свободно', 30: 'Бронь', 32: 'Бронь' };

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

async function listAllSell(complexId) {
  const items = [];
  let from;
  for (;;) {
    const page = await call('/estateSell/list', {
      complexIds: [complexId],
      categories: ['comm'],
      ...(from ? { from } : {}),
    });
    items.push(...page.data);
    if (!page.meta?.next) break;
    from = page.meta.next;
  }
  return items;
}

// houseId → { floorsCount, deliveryLabel } — для "Этаж N/17" и срока сдачи в попапе лота.
async function houseInfoByComplex(complexId) {
  const houses = await call('/estateHouses/list', { complexIds: [complexId] }).catch(() => ({ data: [] }));
  const map = {};
  for (const h of houses.data ?? []) {
    map[h.id] = { floorsCount: h.floorsCount || undefined, deliveryLabel: deliveryLabel(h) };
  }
  return map;
}

const ROMAN_Q = ['I', 'II', 'III', 'IV'];
function deliveryLabel(house) {
  if (!house.inServiceDate) return undefined;
  const introduced = new Date(house.inServiceDate);
  if (introduced <= new Date()) return 'Дом введён в эксплуатацию';
  if (!house.inServiceMonth || !house.inServiceYear) return undefined;
  const q = ROMAN_Q[Math.floor((house.inServiceMonth - 1) / 3)];
  return `${q} кв. ${house.inServiceYear}`;
}

const fmtArea = (n) => n.toFixed(1).replace('.', ',');
const fmtPriceMln = (rub) => (rub / 1_000_000).toFixed(1).replace('.', ',') + ' млн ₽';

function buildTags(item) {
  const tags = [];
  if (item.floor === 1) tags.push('Первая линия');
  // Большинство лотов — стандартные потолки 2,7–3 м; отмечаем только то, что выше.
  if (item.ceilingHeight && item.ceilingHeight > 3) tags.push(`Потолки ${String(item.ceilingHeight).replace('.', ',')} м`);
  return tags;
}

const result = {};

for (const [slug, complexId] of Object.entries(COMPLEX_MAP)) {
  const [raw, houses] = await Promise.all([listAllSell(complexId), houseInfoByComplex(complexId)]);
  const visible = raw.filter((item) => item.status in STATUS_LABEL);

  // Для лотов в «маркетинговом резерве» (32) цена в CRM часто служебная
  // (например, 1 ₽) — не настоящая стоимость, а просто placeholder.
  const MIN_REAL_PRICE_KOPECKS = 1_000_000; // 10 000 ₽
  const hasRealPrice = (item) => item.price && item.price >= MIN_REAL_PRICE_KOPECKS;

  const plans = visible
    .map((item) => ({
      area: fmtArea(item.areaTotal),
      price: hasRealPrice(item) ? fmtPriceMln(item.price / 100) : 'По запросу',
      priceM2: hasRealPrice(item) && item.priceM2 ? Math.round(item.priceM2 / 100) : undefined,
      status: STATUS_LABEL[item.status],
      tags: buildTags(item),
      number: item.number || undefined,
      floor: item.floor ?? undefined,
      floorsTotal: houses[item.houseId]?.floorsCount,
      entrance: item.entrance ?? undefined,
      deliveryLabel: houses[item.houseId]?.deliveryLabel,
      // Ссылка на картинку планировки из MacroCRM — временная (обычно на
      // несколько дней), поэтому она протухнет к следующей пересборке и
      // перезапишется свежей, а не станет мёртвой на сайте.
      planImage: item.planImage || undefined,
      _sortPrice: hasRealPrice(item) ? item.price : Infinity, // лоты без цены — в конец списка
    }))
    .sort((a, b) => a._sortPrice - b._sortPrice)
    .map(({ _sortPrice, ...plan }) => plan);

  const areas = visible.map((i) => i.areaTotal);
  const pricedOnly = visible.filter(hasRealPrice).map((i) => i.price / 100);
  const freeUnits = visible.filter((i) => i.status === 20).length;

  result[slug] = {
    freeUnits,
    areaRange: areas.length ? [Math.round(Math.min(...areas)), Math.round(Math.max(...areas))] : [0, 0],
    priceFrom: pricedOnly.length ? +(Math.min(...pricedOnly) / 1_000_000).toFixed(1) : 0,
    plans,
  };

  console.log(`${slug} (complex ${complexId}): ${visible.length} лотов (${freeUnits} свободно)`);
}

await writeFile(
  new URL('../src/data/macro-plans.generated.json', import.meta.url),
  JSON.stringify(result, null, 2) + '\n',
);
console.log('Written src/data/macro-plans.generated.json');
