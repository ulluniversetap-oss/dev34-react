import { useEffect, useRef, useState } from 'react';
import { useLeadModal } from './LeadModal';
import { BIZ_CARDS } from '../data/bizCards';

export default function BizSlider() {
  const { open: openLead } = useLeadModal();
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth - 2;
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft >= max);
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const step = () => {
    const track = trackRef.current;
    const card = track?.querySelector('.bizc');
    if (!track || !card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  return (
    <section className="sect" id="biz">
      <div className="wrap">
        <div className="shead">
          <div>
            <h2>Под какой бизнес подойдёт помещение</h2>
            <p>Технические требования у каждого формата свои. Выберите свой — покажем только подходящие площади.</p>
          </div>
          <div className="bizn">
            <button type="button" aria-label="Предыдущие" disabled={atStart} onClick={() => trackRef.current?.scrollBy({ left: -step(), behavior: 'smooth' })}>
              <svg viewBox="0 0 14 14" fill="none">
                <path d="M9 2 3 7l6 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" aria-label="Следующие" disabled={atEnd} onClick={() => trackRef.current?.scrollBy({ left: step(), behavior: 'smooth' })}>
              <svg viewBox="0 0 14 14" fill="none">
                <path d="M5 2l6 5-6 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bizslider">
          <div className="bizgrid" ref={trackRef} onScroll={update}>
            {BIZ_CARDS.map((c) => (
              <a
                href="#catalog"
                className="bizc"
                key={c.title}
                onClick={(e) => {
                  e.preventDefault();
                  openLead();
                }}
              >
                <div className="bizc__hd">
                  <div className="bizc__t" dangerouslySetInnerHTML={{ __html: c.title }} />
                  <span className="chip chip--line bizc__n">{c.lots}</span>
                </div>
                <div className="bizc__specs">
                  {c.specs.map(([label, value]) => (
                    <div className="bizc__row" key={label}>
                      <i>{label}</i>
                      <b>{value}</b>
                    </div>
                  ))}
                </div>
                <div className="bizc__ft">
                  <span className="bizc__link">Получить предложение</span>
                  <span className="bizc__arrow">
                    <svg viewBox="0 0 14 14" fill="none">
                      <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
