import { useState } from 'react';

export default function GallerySlider({ photos, alt }: { photos: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const go = (next: number) => setI((next + photos.length) % photos.length);

  return (
    <div className="ogal">
      {photos.map((src, idx) => (
        <div key={src} className={`ogal__slide${idx === i ? ' on' : ''}`}>
          <img src={src} alt={alt} loading={idx === 0 ? undefined : 'lazy'} />
        </div>
      ))}
      <div className="ogal__count">
        {i + 1} / {photos.length}
      </div>
      <button className="ogal__arrow ogal__arrow--l" aria-label="Предыдущее фото" onClick={() => go(i - 1)}>
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="ogal__arrow ogal__arrow--r" aria-label="Следующее фото" onClick={() => go(i + 1)}>
        <svg viewBox="0 0 16 16" fill="none">
          <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="ogal__dots">
        {photos.map((src, idx) => (
          <button key={src} className={`ogal__dot${idx === i ? ' on' : ''}`} aria-label={`Фото ${idx + 1}`} onClick={() => go(idx)} />
        ))}
      </div>
    </div>
  );
}
