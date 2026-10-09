import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GallerySlider from '../components/GallerySlider';
import InfraMap from '../components/InfraMap';
import { useLeadModal } from '../components/LeadModal';
import { getZhkBySlug, ZHK } from '../data/zhk';

const arrowIcon = (
  <svg viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8.5 3.5 12 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ZhkPage() {
  const { slug } = useParams<{ slug: string }>();
  const zhk = slug ? getZhkBySlug(slug) : undefined;
  const { open: openLead } = useLeadModal();

  if (!zhk) {
    return (
      <>
        <Header variant="light" />
        <div className="wrap" style={{ padding: '80px 0' }}>
          <h1>ЖК не найден</h1>
          <Link to="/">На главную</Link>
        </div>
        <Footer />
      </>
    );
  }

  // «Похожие объекты» — все остальные уникальные комплексы, кроме текущего.
  const similar = ZHK.filter((z) => z.slug !== zhk.slug && z.name !== zhk.name).slice(0, 4);

  return (
    <>
      <Header variant="light" />

      <div className="wrap">
        <nav className="bc" aria-label="Breadcrumb">
          <Link to="/">Главная</Link>
          <span className="sep">›</span>
          <Link to="/#catalog">Помещения</Link>
          <span className="sep">›</span>
          <span className="cur">
            ЖК «{zhk.name}
            {zhk.phase ? ` ${zhk.phase}` : ''}»
          </span>
        </nav>
      </div>

      <section className="ohero">
        <div className="wrap">
          <div className="obadges">
            <span className="chip chip--dark">{zhk.phaseLabel}</span>
            <span className="chip chip--gold">{zhk.district} район</span>
            <span className="chip chip--line">Первая линия</span>
          </div>
          <h1 className="oh1">
            ЖК «{zhk.name}
            {zhk.phase ? ` ${zhk.phase}` : ''}»
          </h1>

          <div className="ogrid">
            <GallerySlider photos={zhk.galleryPhotos} alt={`ЖК «${zhk.name}»`} />

            <aside className="side">
              <div className="side__cnt">
                <b>{zhk.freeUnits}</b> свободных
                <br />
                помещений сейчас
              </div>
              <div className="specs">
                <div className="spec">
                  <span className="spec__l">Площади</span>
                  <span className="spec__v">
                    {zhk.areaRange[0]} — {zhk.areaRange[1]} м²
                  </span>
                </div>
                <div className="spec">
                  <span className="spec__l">Цена</span>
                  <span className="spec__v">от {zhk.priceFrom.toString().replace('.', ',')} млн ₽</span>
                </div>
                {zhk.rentFrom && (
                  <div className="spec">
                    <span className="spec__l">Аренда</span>
                    <span className="spec__v">от {zhk.rentFrom.toLocaleString('ru-RU')} ₽/м²/мес</span>
                  </div>
                )}
                <div className="spec">
                  <span className="spec__l">Потолки</span>
                  <span className="spec__v">{zhk.ceilingHeight}</span>
                </div>
                <div className="spec">
                  <span className="spec__l">Этажей</span>
                  <span className="spec__v">{zhk.floors}</span>
                </div>
                {zhk.deliveryQuarter && (
                  <div className="spec">
                    <span className="spec__l">Сдача</span>
                    <span className="spec__v">{zhk.deliveryQuarter}</span>
                  </div>
                )}
                <div className="spec">
                  <span className="spec__l">Готовность</span>
                  <span className="spec__v">{zhk.phaseLabel}</span>
                </div>
              </div>
              <div className="side__cta">
                <button
                  className="btn btn--gold"
                  onClick={openLead}
                >
                  Подобрать помещение {arrowIcon}
                </button>
                <a href="tel:+78442244811" className="btn btn--outline">
                  +7 (8442) 24-48-11
                </a>
              </div>
              <p className="side__note">Информация не является публичной офертой</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="plans" id="plans">
        <div className="wrap">
          <div className="shead">
            <div>
              <h2>Лучшие планировки</h2>
              <p>От небольших помещений на первой линии до крупных площадей под магазин или супермаркет</p>
            </div>
          </div>
          <div className="plansgrid">
            {zhk.plans.map((plan, idx) => (
              <article className="planc" key={idx}>
                <div className="planc__ph">
                  <span className={`chip ${plan.status === 'Бронь' ? 'chip--dark' : 'chip--line'} planc__status`}>{plan.status}</span>
                  <svg className="planc__icon" viewBox="0 0 40 40" fill="none">
                    <rect x="4" y="4" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M20 4v14M4 18h16M20 18v18" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M29 23v13M20 29h16" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <span className="planc__plabel">План помещения</span>
                </div>
                <div className="planc__b">
                  <div className="planc__meta">
                    <div className="planc__area">
                      {plan.area} <span>м²</span>
                    </div>
                    <div className="planc__price">{plan.price}</div>
                  </div>
                  <div className="planc__tags">
                    {plan.tags.map((tag) => (
                      <span className="ptag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="planc__ft">
                    <button className="btn btn--outline" onClick={openLead}>
                      Забронировать {arrowIcon}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="plans__more">
            <a href="/#catalog" className="btn btn--outline">
              Смотреть ещё помещения {arrowIcon}
            </a>
          </div>
        </div>
      </section>

      <section className="sect sect--white">
        <div className="wrap">
          <div className="shead">
            <div>
              <h2>{zhk.trafficHeadline}</h2>
              <p>Пешеходный поток, плотность жителей и технические параметры помещений</p>
            </div>
          </div>
          <div className="trustbento2 trustbento2--traffic">
            <div className="tp">
              <div className="tp__bg" style={{ backgroundImage: `url('${zhk.catalogPhoto}')` }} />
              <span className="tp__badge">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M12 9v6M9 11l-3 2.5M15 11l3 2.5M9 21l3-6 3 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Трафик участка
              </span>
              <h3>
                {zhk.trafficPeople}
                <br />
                проходит мимо витрин
              </h3>
              <p>{zhk.trafficText}</p>
              <a href="#plans" className="tp__link">
                Смотреть планировки
                <span>
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </div>

            <div className="tc tc--accent">
              <div className="tc__i">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 21V8l7-4 7 4v13M5 21h14M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>{zhk.statApartments}</h4>
              <p>{zhk.statResidents}</p>
            </div>
            <div className="tc">
              <div className="tc__i">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v18M7 7l5-4 5 4M5 21h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>{zhk.ceilingHeight}</h4>
              <p>высота потолков помещений</p>
            </div>
            <div className="tc">
              <div className="tc__i">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>{zhk.statPower}</h4>
              <p>выделенная мощность на помещение</p>
            </div>
            <div className="tc">
              <div className="tc__i">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3.5" y="7" width="17" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M6.5 7 8 3.5h8L17.5 7M7 14h.01M17 14h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <h4>{zhk.statParking}</h4>
              <p>{zhk.statParkingGuest}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sect" id="map">
        <div className="wrap">
          <div className="shead">
            <div>
              <h2>Расположение и инфраструктура</h2>
              <p>Проходимость формирует инфраструктура — включите категории и увидите, кто ходит мимо витрины каждый день</p>
            </div>
          </div>
          <InfraMap zhk={zhk} biasNorthwest={zhk.slug === 'bereg-volgi-1'} />
        </div>
      </section>

      {similar.length > 0 && (
        <section className="sect sect--white">
          <div className="wrap">
            <div className="shead">
              <div>
                <h2>Похожие объекты</h2>
              </div>
            </div>
            <div className="jkgrid">
              {similar.map((z) => (
                <Link key={z.slug} to={`/zhk/${z.slug}`} className="jk">
                  <div className="jk__ph">
                    <img src={z.catalogPhoto} alt={`ЖК «${z.name}»`} loading="lazy" />
                    <span className={`chip ${z.status === 'Сдан' ? 'chip--dark' : 'chip--light'} jk__status`}>{z.status}</span>
                  </div>
                  <div className="jk__b">
                    <div className="jk__hd">
                      <h3 className="jk__t">ЖК «{z.name}»</h3>
                      <span className="jk__arrow">
                        <svg viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                    <div className="jk__sub">{z.district} район</div>
                    <div className="jk__meta">
                      <span className="chip chip--line">{z.freeUnits} помещений</span>
                      <span className="chip chip--line">
                        {z.areaRange[0]} — {z.areaRange[1]} м²
                      </span>
                    </div>
                    <div className="jk__price">
                      <span>от</span>
                      {z.priceFrom.toString().replace('.', ',')} млн ₽
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
