import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PlanCard } from '../data/zhk';

interface Props {
  plan: PlanCard;
  zhkName: string;
  zhkAddress: string;
  onBook: () => void;
}

// Миниатюра планировки на карточке отрисовывается на 15% мельче (чтобы не
// доминировать над карточкой), а по клику открывается карточка-попап с
// деталями помещения — по образцу того, как это сделано в MacroCRM, но в
// стиле нашего сайта.
export default function PlanImageZoom({ plan, zhkName, zhkAddress, onBook }: Props) {
  const [open, setOpen] = useState(false);
  const src = plan.planImage!;
  const alt = `Планировка, ${plan.area} м²`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="Открыть карточку помещения"
        style={{ width: '100%', height: '100%', padding: 0, border: 0, background: 'none', cursor: 'zoom-in' }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12, transform: 'scale(0.85)' }}
          onError={(e) => {
            e.currentTarget.closest('button')!.style.display = 'none';
          }}
        />
      </button>
      {open &&
        createPortal(
          <div className="planm__ovl" onClick={() => setOpen(false)}>
            <div className="planm" onClick={(e) => e.stopPropagation()}>
              <div className="planm__ph">
                <span className={`chip ${plan.status === 'Бронь' ? 'chip--dark' : 'chip--line'} planm__status`}>{plan.status}</span>
                <button type="button" className="planm__x" aria-label="Закрыть" onClick={() => setOpen(false)}>
                  ×
                </button>
                <img src={src} alt={alt} />
              </div>
              <div className="planm__b">
                <div className="planm__t">{plan.number ? `Помещение №${plan.number}` : 'Коммерческое помещение'}</div>
                <div className="planm__sub">
                  ЖК «<b>{zhkName}</b>», {zhkAddress}
                </div>

                <div className="planm__stats">
                  <div className="planm__stat">
                    <b>
                      {plan.area} м<sup>2</sup>
                    </b>
                    <span>Площадь</span>
                  </div>
                  <div className="planm__stat">
                    <b>{plan.price}</b>
                    <span>Стоимость</span>
                  </div>
                  {plan.priceM2 && (
                    <div className="planm__stat">
                      <b>{plan.priceM2.toLocaleString('ru-RU')} ₽</b>
                      <span>Цена за м²</span>
                    </div>
                  )}
                </div>

                {(plan.floor || plan.entrance) && (
                  <div className="planm__specs">
                    {plan.floor && (
                      <div className="spec">
                        <span className="spec__l">Этаж</span>
                        <span className="spec__v">{plan.floor}</span>
                      </div>
                    )}
                    {plan.entrance && (
                      <div className="spec">
                        <span className="spec__l">Подъезд</span>
                        <span className="spec__v">{plan.entrance}</span>
                      </div>
                    )}
                  </div>
                )}

                {plan.tags.length > 0 && (
                  <div className="planm__tags">
                    {plan.tags.map((tag) => (
                      <span className="ptag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="planm__ft">
                  <button type="button" className="btn btn--gold" onClick={onBook}>
                    Забронировать
                  </button>
                  <a href="tel:+78442244811" className="btn btn--outline">
                    +7 (8442) 24-48-11
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
