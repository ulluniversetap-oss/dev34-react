import { ZHK } from '../data/zhk';

export type Deal = 'buy' | 'rent';

export interface Lot {
  jk: number;
  deal: Deal;
  area: number;
  price: number;
  ready: string;
}

// Детерминированный псевдослучайный генератор — чтобы счётчик лотов был
// стабильным между рендерами (как в статической версии).
function rnd(seed: number) {
  let x = seed * 9301 + 49297;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

export const LOTS: Lot[] = (() => {
  const lots: Lot[] = [];
  ZHK.forEach((j, ji) => {
    const R = rnd(ji + 7);
    const [a0, a1] = j.areaRange;
    const years = j.status === 'Сдан' ? ['Сдан'] : ji % 2 ? ['2027'] : ['2026', '2027'];
    const mk = (n: number, deal: Deal) => {
      for (let k = 0; k < n; k++) {
        const t = n > 1 ? k / (n - 1) : 0;
        const area = Math.round(a0 + (a1 - a0) * Math.pow(t, 1.7) + (R() - 0.5) * 8);
        const price = +(j.priceFrom * Math.pow(area / a0, 0.92) * (0.96 + R() * 0.1)).toFixed(1);
        lots.push({ jk: ji, deal, area, price, ready: years[k % years.length] });
      }
    };
    mk(j.freeUnits, 'buy');
    mk(j.rentUnits ?? 0, 'rent');
  });
  return lots;
})();
