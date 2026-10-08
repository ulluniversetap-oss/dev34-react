import { useState } from 'react';
import { FAQ } from '../data/faq';

export default function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="faqgrid">
      {FAQ.map((f, i) => (
        <div className={`faqi${openIdx === i ? ' on' : ''}`} key={f.q}>
          <button
            type="button"
            className="faqi__q"
            aria-expanded={openIdx === i}
            onClick={() => setOpenIdx((cur) => (cur === i ? null : i))}
          >
            <span>{f.q}</span>
            <span className="faqi__ic" />
          </button>
          <div className="faqi__a">
            <div>
              <p>{f.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
