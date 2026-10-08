import { useEffect, useRef, useState } from 'react';

const ICO = {
  rub: (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M5.6 13V3.4h3.6a2.9 2.9 0 0 1 0 5.8H4m0 2.1h4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M8 14.5s5-4.3 5-8a5 5 0 0 0-10 0c0 3.7 5 8 5 8Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="6.4" r="1.8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  pct: (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M3.5 12.5 12.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="5" cy="5" r="1.9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="1.9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  clk: (
    <svg viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.7V8l2.2 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  key: (
    <svg viewBox="0 0 16 16" fill="none">
      <circle cx="5.4" cy="5.4" r="2.9" stroke="currentColor" strokeWidth="1.5" />
      <path d="m7.6 7.6 5 5M10.4 10.4l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

interface Slide {
  bg: string;
  fx?: string;
  big?: boolean;
  tags: [React.ReactNode, string][];
  title: string;
  lead?: string;
  cta: string;
  href: string;
}

const SLIDES: Slide[] = [
  {
    bg: '/assets/img/hero-slide-1.jpg',
    tags: [
      [ICO.rub, 'от 3,1 млн ₽'],
      [ICO.pin, '8 новостроек Волгограда'],
      [ICO.pct, 'Рассрочка 0%'],
    ],
    title: 'Коммерческие помещения<br>в новостройках Волгограда',
    cta: 'Подобрать помещение',
    href: '#catalog',
  },
  {
    big: true,
    bg: '/assets/img/hero-slide-2.jpg',
    fx: 'brightness(.52) saturate(1.08)',
    tags: [
      [ICO.pct, 'Условие месяца'],
      [ICO.rub, 'первый взнос 30%'],
    ],
    title: 'Рассрочка&nbsp;0%<br>на&nbsp;12&nbsp;месяцев',
    lead: 'Без переплаты, без справок о доходе и поручителей. <br>График платежей подбираем под выручку вашего бизнеса.',
    cta: 'Условия рассрочки',
    href: '#offers',
  },
  {
    big: true,
    bg: '/assets/img/hero-slide-3.jpg',
    tags: [
      [ICO.key, 'Готово к заезду'],
      [ICO.pin, '8 комплексов'],
    ],
    title: 'Помещения<br>с&nbsp;отделкой <em>−25%</em>',
    lead: 'Стяжка, штукатурка, электрика и сантехника готовы.<br>Остаётся оформить витрину под бренд.',
    cta: 'Смотреть помещения с отделкой',
    href: '#catalog',
  },
  {
    big: true,
    bg: '/assets/img/hero-slide-4.jpg',
    tags: [
      [ICO.clk, 'до 15 августа'],
      [ICO.rub, 'бесплатно'],
    ],
    title: 'Фиксация цены<br>на&nbsp;14&nbsp;дней',
    lead: 'Бронируем выбранный лот и держим цену, <br>пока вы считаете экономику и согласуете кредит.',
    cta: 'Забронировать лот',
    href: '#contacts',
  },
];

const DUR = 7000;

export default function HeroSlider() {
  const [cur, setCur] = useState(0);
  const timerRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef({ x: 0, y: 0 });

  const go = (i: number) => setCur(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);

  const restart = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => setCur((c) => (c + 1) % SLIDES.length), DUR);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--dur', DUR + 'ms');
  }, []);

  useEffect(() => {
    restart();
    const onVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) window.clearInterval(timerRef.current);
      } else {
        restart();
      }
    };
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        go(cur + 1);
        restart();
      }
      if (e.key === 'ArrowLeft') {
        go(cur - 1);
        restart();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('keydown', onKeydown);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('keydown', onKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      go(cur + (dx < 0 ? 1 : -1));
      restart();
    }
  };

  const active = SLIDES[cur];

  return (
    <>
      <div className="hero__bg">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`bg${i === cur ? ' on' : ''}`}
            style={{ backgroundImage: `url('${s.bg}')`, filter: s.fx }}
          />
        ))}
      </div>

      <div className="stage" ref={stageRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="wrap stage__in">
          <div className="slides">
            {SLIDES.map((s, i) => (
              <article key={i} className={`slide${i === cur ? ' on' : ''}${s.big ? ' slide--big' : ''}`}>
                <div className="slide__top">
                  <div className="tags">
                    {s.tags.map(([ic, t], j) => (
                      <span className={`tag${j > 1 ? ' tag--hide-sm' : ''}`} key={j}>
                        {ic}
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="disp" dangerouslySetInnerHTML={{ __html: s.title }} />
                </div>
                {s.lead && (
                  <div className="slide__bot">
                    <p className="lead" dangerouslySetInnerHTML={{ __html: s.lead }} />
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className="stage__ft">
            <a className="btn btn--gold" href={active.href}>
              {active.cta}
              <svg viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8.5 3.5 12 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div className="dots">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`dot${i === cur ? ' on' : ''}`}
                  aria-label={`Слайд ${i + 1}`}
                  onClick={() => {
                    go(i);
                    restart();
                  }}
                >
                  <svg viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="21" />
                  </svg>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
