declare global {
  interface Window {
    ymaps3?: any;
  }
}

// Скрипт Яндекс.Карт грузится асинхронно (а не блокирующим тегом, как в
// статической версии, — иначе React не мог бы отрисоваться, пока карты
// не загрузятся), поэтому window.ymaps3 может ещё отсутствовать в момент
// монтирования InfraMap. Ждём его появления вместо однократной проверки.
export function waitForYmaps3(timeoutMs = 10000): Promise<any | null> {
  if (window.ymaps3) return Promise.resolve(window.ymaps3);
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      if (window.ymaps3) {
        resolve(window.ymaps3);
      } else if (Date.now() - start > timeoutMs) {
        resolve(null);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}
