import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="ftr" id="contacts">
      <div className="wrap">
        <div className="ftr__top">
          <div className="ftr__brand">
            <Link to="/" className="logo">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 245 245" height="34" width="34">
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
            <p>Коммерческая недвижимость в новостройках Волгограда. Эксклюзивный партнёр восьми застройщиков региона.</p>
          </div>
          <div className="ftr__col">
            <h5>Разделы</h5>
            <a href="/#catalog">Помещения</a>
            <a href="/#offers">Условия</a>
            <a href="/#map">Расположение</a>
            <a href="/#deal">Сделка</a>
            <a href="/#contacts">Контакты</a>
          </div>
          <div className="ftr__col">
            <h5>Информация</h5>
            <a href="#">О компании</a>
            <a href="#">Документы</a>
            <a href="#">Способы оплаты</a>
            <a href="#">Политика обработки данных</a>
          </div>
          <div className="ftr__off">
            <h5>Офисы продаж</h5>
            ул. Советская, 28
            <br />
            ул. Степана Разина, 6 — ЖК «Берег Волги»
            <br />
            ул. Историческая, 178 — ЖК «Герои Поколений»
            <strong>+7 (8442) 24-48-11</strong>
          </div>
        </div>
        <div className="ftr__hr" />
        <div className="ftr__bot">
          <span>© 2026 developer34. Все права защищены.</span>
          <span>Информация на сайте не является публичной офертой.</span>
        </div>
      </div>
    </footer>
  );
}
