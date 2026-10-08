import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LotFilterState } from '../hooks/useLotFilter';
import { ZHK } from '../data/zhk';
import { plural } from '../lib/format';

const DISTRICTS = ['Дзержинский', 'Ворошиловский', 'Краснооктябрьский', 'Тракторозаводский', 'Советский'];

const ARROW = (
  <svg viewBox="0 0 12 12" fill="none">
    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const HEART = (
  <svg viewBox="0 0 16 16" fill="none">
    <path
      d="M8 13.6S1.7 9.9 1.7 5.8A3.1 3.1 0 0 1 8 4.3a3.1 3.1 0 0 1 6.3 1.5c0 4.1-6.3 7.8-6.3 7.8Z"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

const fmtP = (v: number) => String(v).replace('.', ',');

function JkCard({ z, mode }: { z: (typeof ZHK)[number]; mode: 'buy' | 'rent' }) {
  const [fav, setFav] = useState(false);
  const count = mode === 'rent' ? z.rentUnits ?? 0 : z.freeUnits;
  const price =
    mode === 'rent' ? (
      z.rentFrom ? (
        <>
          <span>от</span>
          {z.rentFrom.toLocaleString('ru-RU')} ₽/м²
        </>
      ) : (
        <>
          <span>цена</span>по запросу
        </>
      )
    ) : (
      <>
        <span>от</span>
        {fmtP(z.priceFrom)} млн ₽
      </>
    );

  return (
    <Link to={`/zhk/${z.slug}`} className="jk">
      <div className="jk__ph">
        <img src={z.heroPhoto} alt={`ЖК «${z.name}»${z.phase ? ` ${z.phase}` : ''}`} loading="lazy" />
        <span className={`chip ${z.status === 'Сдан' ? 'chip--dark' : 'chip--light'} jk__status`}>{z.status}</span>
        <button
          type="button"
          className={`jk__fav${fav ? ' on' : ''}`}
          aria-label="В избранное"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFav((v) => !v);
          }}
        >
          {HEART}
        </button>
      </div>
      <div className="jk__b">
        <div className="jk__hd">
          <h3 className="jk__t">
            ЖК «{z.name}»{z.phase ? ` ${z.phase}` : ''}
          </h3>
          <span className="jk__arrow">{ARROW}</span>
        </div>
        <div className="jk__sub">{z.district} район</div>
        <div className="jk__meta">
          <span className="chip chip--line">
            {count} {plural(count, ['помещение', 'помещения', 'помещений'])}
          </span>
          <span className="chip chip--line">
            {z.areaRange[0]} — {z.areaRange[1]} м²
          </span>
        </div>
        <div className="jk__price">{price}</div>
      </div>
    </Link>
  );
}

export default function JkCatalog({ filter }: { filter: LotFilterState }) {
  const { deal, setDeal } = filter;
  const [district, setDistrict] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const list = useMemo(() => {
    let l = ZHK.filter((z) => (deal === 'rent' ? (z.rentUnits ?? 0) > 0 : true));
    if (district !== 'all') l = l.filter((z) => z.district === district);
    if (status !== 'all') l = l.filter((z) => z.status === status);
    return l;
  }, [deal, district, status]);

  const all = useMemo(() => ZHK.filter((z) => (deal === 'rent' ? (z.rentUnits ?? 0) > 0 : true)), [deal]);
  const lots = all.reduce((s, z) => s + (deal === 'rent' ? z.rentUnits ?? 0 : z.freeUnits), 0);

  return (
    <section className="sect" id="catalog">
      <div className="wrap">
        <div className="shead">
          <div>
            <h2>
              Жилые комплексы <b>{all.length}</b>
            </h2>
            <p>
              {lots} {plural(lots, ['помещение', 'помещения', 'помещений'])} {deal === 'rent' ? 'в аренду' : 'в продаже'}
            </p>
          </div>
          <div className="seg">
            <button className={deal === 'buy' ? 'on' : ''} onClick={() => setDeal('buy')}>
              Покупка
            </button>
            <button className={deal === 'rent' ? 'on' : ''} onClick={() => setDeal('rent')}>
              Аренда
            </button>
          </div>
        </div>

        <div className="pills" id="fDistrict">
          <button className={`pill${district === 'all' ? ' on' : ''}`} onClick={() => setDistrict('all')}>
            Все районы
          </button>
          {DISTRICTS.map((d) => (
            <button key={d} className={`pill${district === d ? ' on' : ''}`} onClick={() => setDistrict(d)}>
              {d}
            </button>
          ))}
          <button
            className={`pill${status === 'Сдан' ? ' on' : ''}`}
            onClick={() => setStatus((s) => (s === 'Сдан' ? 'all' : 'Сдан'))}
          >
            Сдан
          </button>
          <button
            className={`pill${status === 'Строится' ? ' on' : ''}`}
            onClick={() => setStatus((s) => (s === 'Строится' ? 'all' : 'Строится'))}
          >
            Строится
          </button>
        </div>

        <div className="jkgrid">
          {list.length ? (
            list.map((z) => <JkCard key={z.slug} z={z} mode={deal} />)
          ) : (
            <div className="jk__empty">По этим фильтрам пока ничего нет — попробуйте сбросить район или статус.</div>
          )}
        </div>
      </div>
    </section>
  );
}
