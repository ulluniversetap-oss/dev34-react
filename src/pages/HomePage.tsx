import { useState } from 'react';
import { asset } from '../lib/asset';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';
import FilterPanel from '../components/FilterPanel';
import JkCatalog from '../components/JkCatalog';
import BizSlider from '../components/BizSlider';
import FaqAccordion from '../components/FaqAccordion';
import InfraMap from '../components/InfraMap';
import { useLeadModal } from '../components/LeadModal';
import { useLotFilter } from '../hooks/useLotFilter';
import { ZHK } from '../data/zhk';

const ARROW = (
  <svg viewBox="0 0 14 14" fill="none">
    <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Карта на главной показывает только ЖК, у которых указаны реальные
// координаты района — как в статической версии (5 из 8 комплексов).
const MAP_SLUGS = ['geroi-pokoleniy-1', 'bereg-volgi-1', 'tzr-new-1', 'severniy-1', 'matrosova-1'];

export default function HomePage() {
  const { open: openLead } = useLeadModal();
  const filter = useLotFilter();
  const [mapSlug, setMapSlug] = useState(MAP_SLUGS[0]);
  const mapZhk = ZHK.find((z) => z.slug === mapSlug) ?? ZHK[0];

  return (
    <>
      <section className="hero" id="hero">
        <div className="hero__scrim" />
        <div className="hero__grain" />
        <div className="hero__panel-bg" />
        <Header variant="dark" />
        <HeroSlider />
        <FilterPanel filter={filter} />
      </section>

      <JkCatalog filter={filter} />

      <section className="sect sect--white" id="offers">
        <div className="wrap">
          <div className="shead">
            <div>
              <h2>Условия месяца</h2>
              <p>Специальные предложения по аренде и покупке — актуальны в сентябре</p>
            </div>
          </div>

          <div className="ofgrid4">
            <a
              href="#catalog"
              className="ofc ofc4 ofc4--photo"
              onClick={(e) => {
                e.preventDefault();
                openLead();
              }}
            >
              <div className="ofc4__bg" style={{ backgroundImage: `url('${asset('assets/img/promo-450.jpg')}')` }} />
              <div className="ofc4__head">
                <div className="ofc4__price">
                  <span className="ofc4__price-gold">450 ₽</span> <b>за м²</b>
                </div>
                <div className="ofc__label">Первый месяц аренды</div>
                <div className="ofc4__sub">в ЖК «Новый» и ЖК «Герои поколений»</div>
              </div>
              <div className="ofc4__foot">
                <span className="ofc4__badge">
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M5.5 10.5 10.5 5.5M6.2 6.7a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8ZM9.8 11.1a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Условие месяца
                </span>
                <span className="ofc__arrow">{ARROW}</span>
              </div>
            </a>

            <a
              href="#catalog"
              className="ofc ofc4 ofc4--soft"
              onClick={(e) => {
                e.preventDefault();
                openLead();
              }}
            >
              <div className="ofc4__bottom">
                <div className="ofc__label">Скидки на помещения</div>
                <div className="ofc__value">до 5 000 000 ₽</div>
              </div>
              <div className="ofc4__top">
                <div className="ofc__avatars">
                  <img src={asset('assets/img/jk-geroi-1.webp')} alt="" loading="lazy" />
                  <img src={asset('assets/img/jk-bereg-volgi.jpg')} alt="" loading="lazy" />
                  <img src={asset('assets/img/jk-semeyniy.jpg')} alt="" loading="lazy" />
                  <span className="ofc__avatars-more">+5</span>
                </div>
              </div>
              <span className="ofc__arrow">{ARROW}</span>
            </a>

            <a
              href="#catalog"
              className="ofc ofc4 ofc4--soft"
              onClick={(e) => {
                e.preventDefault();
                openLead();
              }}
            >
              <div className="ofc4__bottom">
                <div className="ofc__label">Коммерческие помещения</div>
                <div className="ofc__value">от 3 999 000 ₽</div>
              </div>
              <div className="ofc4__top">
                <div className="ofc__tags">
                  <span>Кофейни и пекарни</span>
                  <span>Пункты выдачи</span>
                  <span>Салоны красоты</span>
                  <span>Аптеки</span>
                  <span>Продуктовые</span>
                  <span className="ofc__tags-more">+3</span>
                </div>
              </div>
              <span className="ofc__arrow">{ARROW}</span>
            </a>

            <a
              href="#catalog"
              className="ofc ofc4 ofc4--soft ofc4--keyscard"
              onClick={(e) => {
                e.preventDefault();
                openLead();
              }}
            >
              <div className="ofc4__bottom">
                <div className="ofc__label">Покупка</div>
                <div className="ofc__value">от 35 000 ₽ за м²</div>
              </div>
              <div className="ofc4__keys">
                <img src={asset('assets/img/promo-keys.png')} alt="" loading="lazy" />
              </div>
              <span className="ofc__arrow">{ARROW}</span>
            </a>
          </div>

          <p className="ofnote">Условия не являются публичной офертой · подробности у менеджера</p>
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
          <InfraMap
            zhk={mapZhk}
            biasNorthwest={mapZhk.slug === 'bereg-volgi-1'}
            tabs={MAP_SLUGS.map((slug) => {
              const z = ZHK.find((x) => x.slug === slug)!;
              return { label: z.name, active: slug === mapSlug, onSelect: () => setMapSlug(slug) };
            })}
          />
        </div>
      </section>

      <section className="sect sect--white" id="perks">
        <div className="wrap">
          <div className="shead">
            <div>
              <h2>Что получает ваш бизнес</h2>
              <p>Расположение, безопасность и планировка — продуманы ещё на этапе проектирования ЖК.</p>
            </div>
          </div>

          <div className="perksgrid">
            {[
              { cls: 'prk prk--hero prk--photo', bg: asset('assets/img/perk-traffic.jpg'), title: 'Локации с большим<br>трафиком', text: 'Постоянный поток жителей района<br>и оживлённые прогулочные зоны' },
              { cls: 'prk prk--hero2 prk--photo', bg: asset('assets/img/perk-schools.jpg'), title: 'Муниципальные школы<br>и детские сады', text: 'Ежедневный гарантированный поток родителей рядом с вашей точкой' },
              { cls: 'prk prk--soft prk--photo', bg: asset('assets/img/perk-fire.jpg'), title: 'Система пожарной<br>сигнализации', text: 'Распознаёт возгорание на ранней стадии по дыму, теплу и пламени' },
              { cls: 'prk prk--photo', bg: asset('assets/img/perk-security.jpg'), title: 'Охраняемая<br>территория', text: 'Круглосуточная охрана территории<br>с системой видеонаблюдения' },
              { cls: 'prk prk--accent prk--photo', bg: asset('assets/img/perk-layouts.jpg'), title: 'Разнообразие<br>планировок', text: 'Подберём или разработаем планировку под любые задачи вашего бизнеса' },
            ].map((p) => (
              <div
                key={p.title}
                className={p.cls}
                onClick={openLead}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLead()}
              >
                <div className="prk__bg" style={{ backgroundImage: `url('${p.bg}')` }} />
                <h3 dangerouslySetInnerHTML={{ __html: p.title }} />
                <div className="prk__ft">
                  <p dangerouslySetInnerHTML={{ __html: p.text }} />
                  <span className="prk__arrow">{ARROW}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BizSlider />

      <section className="sect sect--white">
        <div className="wrap">
          <div className="shead">
            <div>
              <h2>Почему выбирают нас</h2>
              <p>Не посредник, а эксклюзивный канал продаж коммерции в жилых комплексах Волгограда.</p>
            </div>
          </div>

          <div className="trustbento2">
            <div className="tp">
              <div className="tp__bg" style={{ backgroundImage: `url('${asset('assets/img/promo-market-night2.jpg')}')` }} />
              <span className="tp__badge">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5 14 4v4.3c0 3.8-2.6 6.9-6 7.7-3.4-.8-6-3.9-6-7.7V4l6-2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                Эксклюзивный партнёр
              </span>
              <h3>Знаем рынок Волгограда изнутри</h3>
              <p>
                «А+ Бутик недвижимости» — эксклюзивный
                <br />
                партнёр восьми застройщиков региона.
                <br />
                Все коммерческие площади в наших
                <br />
                ЖК проходят через нас.
              </p>
              <a href="#catalog" className="tp__link">
                Смотреть каталог помещений
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
                  <path d="M18.5 5.5 5.5 18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="16" cy="16" r="2.6" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
              <h4>Это выгодно</h4>
              <p>
                Ипотека для бизнеса от партнёров,
                <br />
                скидка при 100% оплате, рассрочка без переплат.
              </p>
            </div>
            <div className="tc">
              <div className="tc__i">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2.5 4 6v6.3c0 5 3.5 9.4 8 10.5 4.5-1.1 8-5.5 8-10.5V6l-8-3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="m8.3 12 2.6 2.6 5-5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>Это безопасно</h4>
              <p>
                Все сделки проходят по 214-ФЗ с защитой средств на эскроу-счетах. Декларации доступны{' '}
                <a href="#">на наш.дом.рф</a>
              </p>
            </div>
            <div className="tc">
              <div className="tc__i">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3.5c-2.8 3.2-5.6 4.3-5.6 7.8a5.6 5.6 0 0 0 11.2 0c0-3.5-2.8-4.6-5.6-7.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>Это просто</h4>
              <p>Готовые решения под любой бюджет: от 45 м² под ПВЗ до 420 м² для федерального арендатора. Документы — онлайн.</p>
            </div>
            <div className="tc">
              <div className="tc__i">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3.5 18 10 11l4 4 6.5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.5 8h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>Это ликвидно</h4>
              <p>Помещения на первой линии в районах с плотной застройкой. Средний срок поиска арендатора — месяц.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sect" id="deal">
        <div className="wrap">
          <div className="shead">
            <div>
              <h2>Как проходит сделка</h2>
              <p>От первого звонка до передачи ключей — сопровождаем на каждом шаге.</p>
            </div>
            <a
              href="#contacts"
              className="btn btn--white"
              onClick={(e) => {
                e.preventDefault();
                openLead();
              }}
            >
              Задать вопрос менеджеру
            </a>
          </div>

          <div className="dealgrid">
            <div className="dealc">
              <span className="dealc__n">01</span>
              <h4>Подбор</h4>
              <p>
                Обсуждаем формат бизнеса, бюджет
                <br />и требования. Присылаем 3–5 вариантов
                <br />с расчётом окупаемости.
              </p>
            </div>
            <div className="dealc">
              <span className="dealc__n">02</span>
              <h4>Просмотр</h4>
              <p>Выезд на объект с менеджером. Проверяем мощность, точку ввода, высоту потолка, зону разгрузки.</p>
            </div>
            <div className="dealc">
              <span className="dealc__n">03</span>
              <h4>Бронь и договор</h4>
              <p>
                Фиксируем цену на 14 дней.
                <br />
                ДДУ по 214-ФЗ, расчёт
                <br />
                через эскроу-счёт.
              </p>
            </div>
            <div className="dealc dealc--accent">
              <span className="dealc__n">04</span>
              <h4>Передача</h4>
              <p>
                Приёмка помещения, регистрация
                <br />
                права, подключение коммуникаций.
                <br />
                Помогаем найти арендатора.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sect sect--white" id="faq">
        <div className="wrap">
          <div className="shead">
            <div>
              <h2>Частые вопросы</h2>
            </div>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <section className="sect" id="contacts">
        <div className="wrap" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2>Остались вопросы?</h2>
          <p style={{ color: 'var(--ink-3)', margin: '10px 0 24px' }}>
            Оставьте заявку — менеджер перезвонит и подберёт помещение под задачу
          </p>
          <button className="btn btn--gold" onClick={openLead}>
            Оставить заявку
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
}
