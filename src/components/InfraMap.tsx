import { useEffect, useRef, useState } from 'react';
import { POI_META, type PoiCategory, type ZhkComplex } from '../data/zhk';

declare global {
  interface Window {
    ymaps3?: any;
  }
}

function plural(n: number, forms: [string, string, string]) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
  return forms[2];
}

const CAT_ICON: Record<PoiCategory, string> = {
  'Остановки транспорта':
    '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="10" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="7" cy="18" r="1.6" fill="currentColor"/><circle cx="17" cy="18" r="1.6" fill="currentColor"/><path d="M3 11h18" stroke="currentColor" stroke-width="2"/></svg>',
  'Продуктовые магазины':
    '<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="18" cy="20" r="1.4" fill="currentColor"/><path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Торговые центры':
    '<svg viewBox="0 0 24 24" fill="none"><path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="2"/></svg>',
  Школы:
    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5c3-1.3 6 0 8 1.5C14 5 17 3.7 20 5v14c-3-1.3-6 0-8 1.5C10 19 7 17.7 4 19V5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 6.5V20.5" stroke="currentColor" stroke-width="2"/></svg>',
  'Детские сады':
    '<svg viewBox="0 0 24 24" fill="none"><circle cx="8" cy="9" r="3" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="9" r="3" stroke="currentColor" stroke-width="2"/><path d="M5 20c0-3 2.5-5 7-5s7 2 7 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  Поликлиники: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  'Спортивные объекты':
    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 9v6M7 7v10M17 7v10M20 9v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 12h10" stroke="currentColor" stroke-width="2"/></svg>',
  'Парки и бульвары':
    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3 7 11h3l-4 7h12l-4-7h3L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 18v3" stroke="currentColor" stroke-width="2"/></svg>',
  'Кафе и рестораны':
    '<svg viewBox="0 0 24 24" fill="none"><path d="M5 6h11v7a5.5 5.5 0 0 1-5.5 5.5A5.5 5.5 0 0 1 5 13V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 8h1.5a2.5 2.5 0 0 1 0 5H16" stroke="currentColor" stroke-width="2"/><path d="M4 21h13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  'Банки и МФЦ':
    '<svg viewBox="0 0 24 24" fill="none"><path d="M3 10 12 4l9 6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M5 10v9M9 10v9M15 10v9M19 10v9M3 19h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

interface MarkerEntry {
  cat: PoiCategory;
  marker: any;
  addedToMap: boolean;
}

// Единый компонент карты с реальными POI-маркерами. Раньше это были
// 150+ строк почти идентичного JS, вручную продублированные в index.html
// и во всех 8 страницах ЖК. Теперь — один компонент, параметризуемый
// данными конкретного ЖК (включая опциональное смещение точек от воды,
// чтобы маркеры не улетали в реку для прибрежных комплексов).
interface MapTab {
  label: string;
  active: boolean;
  onSelect: () => void;
}

export default function InfraMap({
  zhk,
  biasNorthwest = false,
  tabs,
}: {
  zhk: ZhkComplex;
  biasNorthwest?: boolean;
  tabs?: MapTab[];
}) {
  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<MarkerEntry[]>([]);
  const [on, setOn] = useState<Record<PoiCategory, boolean>>(() => {
    const init = {} as Record<PoiCategory, boolean>;
    POI_META.forEach((m) => (init[m.cat] = m.defaultOn));
    return init;
  });

  const totalVisible = POI_META.filter((m) => on[m.cat]).reduce(
    (sum, m) => sum + (zhk.poiNames[m.cat]?.length ?? 0),
    0,
  );

  // Инициализация карты + маркеров — один раз на смену ЖК.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!window.ymaps3 || !mapHostRef.current) return;
      await window.ymaps3.ready;
      if (cancelled) return;
      const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = window.ymaps3;

      const map = new YMap(mapHostRef.current, {
        location: { center: [zhk.lng, zhk.lat], zoom: 15 },
        copyrightsPosition: 'bottom left',
      });
      mapRef.current = map;
      map.addChild(new YMapDefaultSchemeLayer());
      map.addChild(new YMapDefaultFeaturesLayer());

      const mainEl = document.createElement('div');
      mainEl.className = 'lpin--main';
      mainEl.textContent = 'ЖК';
      map.addChild(new YMapMarker({ coordinates: [zhk.lng, zhk.lat] }, mainEl));

      let seed = 11;
      const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
      const entries: MarkerEntry[] = [];

      POI_META.forEach((meta) => {
        const names = zhk.poiNames[meta.cat] ?? [];
        names.forEach((name) => {
          const dLat = biasNorthwest ? (rnd() - 0.1) * 0.01 : (rnd() - 0.5) * 0.01;
          const dLng = biasNorthwest ? (rnd() - 0.85) * 0.014 : (rnd() - 0.5) * 0.014;
          const el = document.createElement('div');
          el.className = 'lpin2wrap';
          el.innerHTML = `<div class="lpin2" style="background:${meta.color}">${CAT_ICON[meta.cat]}</div><span class="lpin2__label">${name}</span>`;
          const marker = new YMapMarker({ coordinates: [zhk.lng + dLng, zhk.lat + dLat] }, el);
          const addedToMap = on[meta.cat];
          if (addedToMap) map.addChild(marker);
          entries.push({ cat: meta.cat, marker, addedToMap });
        });
      });

      markersRef.current = entries;
    })();

    return () => {
      cancelled = true;
      const map = mapRef.current;
      markersRef.current.forEach(({ marker, addedToMap }) => {
        if (map && addedToMap) {
          try {
            map.removeChild(marker);
          } catch {
            /* карта уже уничтожена */
          }
        }
      });
      markersRef.current = [];
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zhk.slug]);

  // Показ/скрытие маркеров конкретной категории — без пересоздания карты.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((entry) => {
      const shouldShow = on[entry.cat];
      if (shouldShow && !entry.addedToMap) {
        map.addChild(entry.marker);
        entry.addedToMap = true;
      } else if (!shouldShow && entry.addedToMap) {
        map.removeChild(entry.marker);
        entry.addedToMap = false;
      }
    });
  }, [on]);

  return (
    <div className="mapbox">
      <aside className="mpanel">
        <div className="mpanel__hd">
          <div className="h4">ЖК «{zhk.name}»</div>
          <div className="mpanel__addr">{zhk.address}</div>
          <div className="mpanel__chip">
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M7 1 8.4 4.9 12.5 5l-3.3 2.5L10.4 11 7 8.7 3.6 11l1.2-3.5L1.5 5l4.1-.1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            <span>
              {totalVisible} {plural(totalVisible, ['объект', 'объекта', 'объектов'])} в радиусе 800 м
            </span>
          </div>
        </div>
        <div className="mpanel__list">
          {POI_META.map((meta) => {
            const count = zhk.poiNames[meta.cat]?.length ?? 0;
            return (
              <button
                key={meta.cat}
                className={`poi${on[meta.cat] ? ' on' : ''}`}
                onClick={() => setOn((prev) => ({ ...prev, [meta.cat]: !prev[meta.cat] }))}
              >
                <span className="poi__b">
                  <svg viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.2 4.6 9 10 3.2" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                <span className="poi__n">{meta.cat}</span>
                <span className="poi__c">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="mpanel__ft">
          <button
            className="btn btn--gold"
            onClick={() => window.open(`https://yandex.ru/maps/?rtext=~${zhk.lat},${zhk.lng}&rtt=auto`, '_blank')}
          >
            Проложить маршрут
          </button>
        </div>
      </aside>

      <div className="mcanvas">
        <div ref={mapHostRef} id="yandexMap" />
        {tabs && (
          <div className="mtabs">
            {tabs.map((t) => (
              <button key={t.label} className={`mtab${t.active ? ' on' : ''}`} onClick={t.onSelect}>
                {t.label}
              </button>
            ))}
          </div>
        )}
        <div className="mzoom">
          <button aria-label="Приблизить" onClick={() => mapRef.current?.setLocation({ zoom: mapRef.current.zoom + 1, duration: 200 })}>
            +
          </button>
          <button aria-label="Отдалить" onClick={() => mapRef.current?.setLocation({ zoom: mapRef.current.zoom - 1, duration: 200 })}>
            −
          </button>
        </div>
      </div>
    </div>
  );
}
