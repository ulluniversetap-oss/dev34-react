import { createContext, useContext, useState, type ReactNode, type FormEvent } from 'react';

interface LeadModalCtx {
  open: () => void;
  close: () => void;
}

const Ctx = createContext<LeadModalCtx | null>(null);

// Хук, которым открывается модалка заявки из любого компонента —
// раньше для этого в 9 html-файлах был продублирован onclick="openLead()".
export function useLeadModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLeadModal must be used inside <LeadModalProvider>');
  return ctx;
}

function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (!digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);
  let out = '+7';
  if (digits.length > 1) out += ' (' + digits.slice(1, 4);
  if (digits.length >= 4) out += ') ' + digits.slice(4, 7);
  if (digits.length >= 7) out += '-' + digits.slice(7, 9);
  if (digits.length >= 9) out += '-' + digits.slice(9, 11);
  return out;
}

function LeadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleClose() {
    onClose();
    // сбрасываем состояние формы после анимации закрытия
    setTimeout(() => {
      setSubmitted(false);
      setPhone('');
    }, 420);
  }

  return (
    <div className={`lead-ovl${isOpen ? ' on' : ''}`} onClick={handleClose}>
      <div className="leadm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lead__x" aria-label="Закрыть" onClick={handleClose}>
          ×
        </button>
        <div className="lead__body">
          {submitted ? (
            <div className="lead__success">
              <div className="lead__success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3>Заявка отправлена</h3>
              <p>Спасибо! Менеджер отдела продаж свяжется с вами в выбранное время.</p>
            </div>
          ) : (
            <>
              <h3 className="lead__title">
                Оставьте заявку и мы
                <br />
                вам перезвоним
              </h3>
              <p className="lead__text">
                Подберём подходящие помещения
                <br />
                под ваш бюджет и задачу, расскажем
                <br />
                об условиях покупки и рассрочке.
              </p>

              <div className="lead__manager">
                <div className="lead__avatars">
                  <img className="lead__avatar-photo" src="/assets/img/manager-1.jpg" alt="" loading="lazy" />
                  <img className="lead__avatar-photo" src="/assets/img/manager-2.jpg" alt="" loading="lazy" />
                  <span className="lead__online" />
                </div>
                <div>
                  <strong>Менеджеры отдела продаж</strong>
                  <span>Ежедневно 8:00–20:00</span>
                </div>
              </div>

              <form className="lead__form" onSubmit={handleSubmit}>
                <input className="lead__input" type="text" name="name" placeholder="Ваше имя" required />
                <input
                  className="lead__input"
                  type="tel"
                  name="phone"
                  placeholder="+7 (___) ___-__-__"
                  required
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                />
                <input className="lead__input" type="email" name="email" placeholder="E-mail (необязательно)" />

                <label className="lead__select-label" htmlFor="leadCallback">
                  Когда вам удобно созвониться?
                </label>
                <select className="lead__select" id="leadCallback" name="callback">
                  <option>Как можно скорее</option>
                  <option>Сегодня после обеда</option>
                  <option>Сегодня вечером</option>
                  <option>Завтра утром</option>
                  <option>Завтра после обеда</option>
                </select>

                <button type="submit" className="btn btn--gold lead__submit">
                  Отправить заявку
                </button>

                <label className="lead__consent">
                  <input type="checkbox" required />
                  <span>
                    Согласен с{' '}
                    <a href="#" onClick={(e) => e.stopPropagation()}>
                      политикой обработки персональных данных
                    </a>
                  </span>
                </label>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Ctx.Provider value={{ open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
      <LeadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Ctx.Provider>
  );
}
