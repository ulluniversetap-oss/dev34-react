import { useEffect, useState } from 'react';

// Миниатюра планировки на карточке отрисовывается на 15% мельче (чтобы не
// доминировать над карточкой), а по клику открывается в полный размер поверх
// страницы — мелкие размеры на плане иначе не разглядеть.
export default function PlanImageZoom({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

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
        aria-label="Увеличить планировку"
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
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10,14,21,.78)',
            backdropFilter: 'blur(4px)',
            padding: 24,
            cursor: 'zoom-out',
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
            style={{
              position: 'fixed',
              top: 18,
              right: 18,
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: 'none',
              background: '#fff',
              fontSize: 19,
              lineHeight: 1,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            ×
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '92vw',
              maxHeight: '88vh',
              objectFit: 'contain',
              background: '#fff',
              borderRadius: 12,
              cursor: 'default',
            }}
          />
        </div>
      )}
    </>
  );
}
