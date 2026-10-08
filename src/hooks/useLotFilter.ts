import { useMemo, useState } from 'react';
import { LOTS, type Deal } from '../lib/lots';

export type Readiness = 'all' | 'Сдан' | '2026' | '2027';

export function useLotFilter() {
  const [deal, setDeal] = useState<Deal>('buy');
  const [aMin, setAMin] = useState(0);
  const [aMax, setAMax] = useState(9999);
  const [pMin, setPMin] = useState(3);
  const [pMax, setPMax] = useState(40);
  const [ready, setReady] = useState<Readiness>('all');

  const setArea = (min: number, max: number) => {
    setAMin(min);
    setAMax(max);
  };

  const matchingCount = useMemo(
    () =>
      LOTS.filter(
        (l) =>
          l.deal === deal &&
          l.area >= aMin &&
          l.area <= aMax &&
          l.price >= pMin - 0.05 &&
          l.price <= pMax + 0.05 &&
          (ready === 'all' || l.ready === ready),
      ).length,
    [deal, aMin, aMax, pMin, pMax, ready],
  );

  const dealLots = useMemo(() => LOTS.filter((l) => l.deal === deal), [deal]);
  const dealTotal = dealLots.length;
  const dealJkCount = useMemo(() => new Set(dealLots.map((l) => l.jk)).size, [dealLots]);

  return {
    deal,
    setDeal,
    aMin,
    aMax,
    setArea,
    pMin,
    pMax,
    setPMin,
    setPMax,
    ready,
    setReady,
    matchingCount,
    dealTotal,
    dealJkCount,
  };
}

export type LotFilterState = ReturnType<typeof useLotFilter>;
