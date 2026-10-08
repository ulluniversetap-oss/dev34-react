import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeadModal } from './LeadModal';
import { ZHK } from '../data/zhk';

const Logo = ({ light = false }: { light?: boolean }) => (
  <Link to="/" className="logo" style={light ? { color: '#fff' } : undefined}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 245 245" height="48" width="48">
      <path
        fill="#CDA24B"
        d="M245 122.5c0 67.655-54.845 122.5-122.5 122.5S0 190.155 0 122.5 54.845 0 122.5 0 245 54.845 245 122.5Z"
      />
      <path
        fill="#fff"
        d="M189.967 157.026h.007v.013L201 176h-5.117l-8.475-14.574h-15.602L180.28 176h-60.651v-4.4h28.078l-5.917-10.174H77.563L69.088 176h-5.116l8.474-14.574H57.591L49.117 176H44l53.133-91.374 15.007-25.808 12.544 21.573 44.563 76.635h15.603L119.941 45.4l2.558-4.4 67.468 116.026Zm-129.818 0h14.855l32.114-55.227-7.427-12.773-39.542 68Zm19.972 0h59.111l-29.555-50.827-29.556 50.827Z"
      />
    </svg>
    <span>
      <b>
        Бутик
        <br />
        недвижимости
      </b>
      <i>коммерция</i>
    </span>
  </Link>
);

// Список ЖК для выпадающего меню / мобильного шита — строится из единых данных,
// а не копируется вручную на каждой странице.
function jkNavItems() {
  const seen = new Set<string>();
  return ZHK.filter((z) => {
    const key = z.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((z) => ({ label: z.name, district: z.district, slug: z.slug }));
}

export default function Header({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { open: openLead } = useLeadModal();
  const jkItems = jkNavItems();

  const headerClass = variant === 'dark' ? 'hdr' : 'hdr2';

  return (
    <>
      <header className={headerClass}>
        <div className="wrap hdr__in">
          <Logo light={variant === 'dark'} />

          <nav className="nav">
            <a href="/#catalog">Помещения</a>
            <div className="drop">
              <span className="nav__t">
                Жилые комплексы
                <svg viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              <div className="dd">
                {jkItems.map((item) => (
                  <Link key={item.slug} to={`/zhk/${item.slug}`}>
                    <span>{item.label}</span>
                    <i>{item.district}</i>
                  </Link>
                ))}
                <Link to="/#catalog" className="dd__all">
                  <span>Все {jkItems.length} комплексов →</span>
                </Link>
              </div>
            </div>
            <a href="/#offers">Условия</a>
            <a href="/#map">Расположение</a>
            <a href="/#deal">Сделка</a>
            <a href="/#contacts">Контакты</a>
          </nav>

          <div className="hdr__act">
            <a href="tel:+78442244811" className="hdr__tel">
              +7 (8442) 24-48-11
            </a>
            <a
              href="#contacts"
              className={variant === 'dark' ? 'ghost' : 'ghost'}
              onClick={(e) => {
                e.preventDefault();
                openLead();
              }}
            >
              Заказать звонок
            </a>
            <button className="burger" aria-label="Меню" onClick={() => setSheetOpen(true)}>
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`sheet${sheetOpen ? ' on' : ''}`} aria-hidden={!sheetOpen}>
        <div className="sheet__in">
          <button className="sheet__x" aria-label="Закрыть" onClick={() => setSheetOpen(false)}>
            ×
          </button>
          <div className="sheet__hd">Разделы</div>
          <a className="sheet__l" href="/#catalog" onClick={() => setSheetOpen(false)}>
            Помещения
          </a>
          <a className="sheet__l" href="/#offers" onClick={() => setSheetOpen(false)}>
            Условия
          </a>
          <a className="sheet__l" href="/#map" onClick={() => setSheetOpen(false)}>
            Расположение
          </a>
          <a className="sheet__l" href="/#deal" onClick={() => setSheetOpen(false)}>
            Сделка
          </a>
          <a className="sheet__l" href="/#contacts" onClick={() => setSheetOpen(false)}>
            Контакты
          </a>
          <div className="sheet__hd">Жилые комплексы</div>
          {jkItems.map((item) => (
            <Link key={item.slug} className="sheet__l" to={`/zhk/${item.slug}`} onClick={() => setSheetOpen(false)}>
              {item.label}
              <i>{item.district}</i>
            </Link>
          ))}
          <div className="sheet__ft">
            <a href="tel:+78442244811" className="sheet__tel">
              +7 (8442) 24-48-11
            </a>
            <a
              href="#contacts"
              className="btn btn--gold"
              onClick={(e) => {
                e.preventDefault();
                setSheetOpen(false);
                openLead();
              }}
            >
              Заказать звонок
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
