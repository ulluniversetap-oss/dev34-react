import { useEffect, useRef, useState } from 'react';
import type { LotFilterState, Readiness } from '../hooks/useLotFilter';
import { plural } from '../lib/format';
import { totalComplexes, totalFreeUnits } from '../data/zhk';

const LO = 3;
const HI = 40;
const fmt = (v: number) => String(v % 1 ? v.toFixed(1) : v).replace('.', ',');

const AREA_PILLS = [
  { label: 'до 60', min: 0, max: 60 },
  { label: '60—100', min: 60, max: 100 },
  { label: '100—200', min: 100, max: 200 },
  { label: '200+', min: 200, max: 9999 },
];

const READY_OPTIONS: { label: string; value: Readiness }[] = [
  { label: 'Любая', value: 'all' },
  { label: 'Сдан', value: 'Сдан' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
];

export default function FilterPanel({ filter }: { filter: LotFilterState }) {
  const { deal, setDeal, setArea, pMin, pMax, setPMin, setPMax, ready, setReady, matchingCount } = filter;

  const [activeAreaPill, setActiveAreaPill] = useState<number | null>(null);
  const [readyOpen, setReadyOpen] = useState(false);
  const [minInput, setMinInput] = useState(fmt(pMin));
  const [maxInput, setMaxInput] = useState(fmt(pMax));
  const readyRef = useRef<HTMLDivElement>(null);
  const readyBtnRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  useEffect(() => setMinInput(fmt(pMin)), [pMin]);
  useEffect(() => setMaxInput(fmt(pMax)), [pMax]);

  useEffect(() => {
    if (!readyOpen) return;
    const positionMenu = () => {
      const r = readyBtnRef.current?.getBoundingClientRect();
      if (!r) return;
      setMenuPos({ top: r.bottom + 8, left: r.left });
    };
    positionMenu();
    const onOutside = (e: MouseEvent) => {
      if (readyRef.current && !readyRef.current.contains(e.target as Node)) setReadyOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setReadyOpen(false);
    };
    window.addEventListener('resize', positionMenu);
    window.addEventListener('scroll', positionMenu, true);
    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('resize', positionMenu);
      window.removeEventListener('scroll', positionMenu, true);
      document.removeEventListener('click', onOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [readyOpen]);

  const pillClick = (i: number) => {
    if (activeAreaPill === i) {
      setActiveAreaPill(null);
      setArea(0, 9999);
    } else {
      setActiveAreaPill(i);
      setArea(AREA_PILLS[i].min, AREA_PILLS[i].max);
    }
  };

  const syncFromRange = (a: number, b: number, movedMin: boolean) => {
    if (a > b - 0.5) {
      if (movedMin) a = b - 0.5;
      else b = a + 0.5;
    }
    setPMin(a);
    setPMax(b);
  };

  const l = (pMin - LO) / (HI - LO);
  const r = (pMax - LO) / (HI - LO);

  const commitInput = (which: 'min' | 'max', raw: string) => {
    let v = parseFloat(raw.replace(',', '.'));
    if (isNaN(v)) v = which === 'min' ? LO : HI;
    v = Math.min(HI, Math.max(LO, v));
    if (which === 'min') syncFromRange(v, pMax, true);
    else syncFromRange(pMin, v, false);
  };

  const readyLabel = READY_OPTIONS.find((o) => o.value === ready)?.label ?? 'Любая';

  return (
    <div className="panel">
      <div className="wrap">
        <div className="panel__hd">
          <h2 className="panel__t">Подберите помещение</h2>
          <div className="panel__n">
            <b>{totalFreeUnits}</b> <span>{plural(totalFreeUnits, ['лот', 'лота', 'лотов'])}</span> в <b>{totalComplexes}</b>{' '}
            <span>{plural(totalComplexes, ['жилом комплексе', 'жилых комплексах', 'жилых комплексах'])}</span> Волгограда
          </div>
        </div>

        <div className="frow">
          <div className="fg fg--deal">
            <div className="fg__l">Сделка</div>
            <div className="seg seg--panel">
              <button className={deal === 'buy' ? 'on' : ''} onClick={() => setDeal('buy')}>
                Купить
              </button>
              <button className={deal === 'rent' ? 'on' : ''} onClick={() => setDeal('rent')}>
                Арендовать
              </button>
            </div>
          </div>

          <div className="fg fg--area">
            <div className="fg__l">Площадь, м²</div>
            <div className="pills">
              {AREA_PILLS.map((p, i) => (
                <button key={p.label} className={`pill${activeAreaPill === i ? ' on' : ''}`} onClick={() => pillClick(i)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="fg fg--grow">
            <div className="fg__l">
              Бюджет, млн ₽<b>{`${fmt(pMin)} — ${fmt(pMax)}`}</b>
            </div>
            <div className="rng">
              <span className="rng__lbl">от</span>
              <input
                className="rng__in"
                inputMode="numeric"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                onBlur={(e) => commitInput('min', e.target.value)}
              />
              <div className="rng__track">
                <div className="rng__rail" />
                <div
                  className="rng__fill"
                  style={{ left: `calc(8px + ${l * 100}% - ${l * 16}px)`, width: `calc(${(r - l) * 100}% - ${(r - l) * 16}px)` }}
                />
                <input
                  type="range"
                  min={LO}
                  max={HI}
                  step={0.1}
                  value={pMin}
                  onChange={(e) => syncFromRange(+e.target.value, pMax, true)}
                />
                <input
                  type="range"
                  min={LO}
                  max={HI}
                  step={0.1}
                  value={pMax}
                  onChange={(e) => syncFromRange(pMin, +e.target.value, false)}
                />
              </div>
              <span className="rng__lbl">до</span>
              <input
                className="rng__in"
                inputMode="numeric"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                onBlur={(e) => commitInput('max', e.target.value)}
              />
              <i className="rng__unit">млн ₽</i>
            </div>
          </div>

          <div className="fg fg--ready">
            <div className="fg__l">Готовность</div>
            <div className={`dsel${readyOpen ? ' on' : ''}`} ref={readyRef}>
              <button
                type="button"
                className="dsel__btn"
                ref={readyBtnRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setReadyOpen((v) => !v);
                }}
              >
                <span>{readyLabel}</span>
                <svg viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </button>
              <div className="dsel__menu" style={{ top: menuPos.top, left: menuPos.left }}>
                {READY_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={ready === o.value ? 'on' : ''}
                    onClick={() => {
                      setReady(o.value);
                      setReadyOpen(false);
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="fg fg--go">
            <a href="#catalog" className="btn btn--gold fgo">
              <span>
                Показать <b>{matchingCount}</b> <span>{plural(matchingCount, ['предложение', 'предложения', 'предложений'])}</span>
              </span>
            </a>
            <a href="#catalog" className="panel__more">
              Все фильтры →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
