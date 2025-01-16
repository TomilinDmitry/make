import React, { useEffect, useRef, useState } from "react";
import s from "./offerModal.module.scss";
import close from "../../../app/assets/home/closeModal.svg";
import checkedIcon from "../../../app/assets/other/checkedIcon.svg";
import scrollIcon from "../../../app/assets/Seller/scrollIcon.svg";
import { useDispatch, useSelector } from "app/service/hooks/hooks";
import { setOpenOffer } from "app/service/seller/AuthorSlice";
import { useNavigate } from "react-router";
export const OfferModal = () => {
  const [isCheck, setIsCheck] = useState(false);
  const [showScrollIcon, setShowScrollIcon] = useState(true);
  const { gb, minutes } = useSelector((state) => state.author);
  const rulesRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const scrollToElement = () => {
    if (rulesRef.current) {
      rulesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollIcon(!entry.isIntersecting);
      },
      { threshold: 0.5 }, // Элемент считается видимым, если хотя бы 50% его площади в зоне видимости
    );

    if (rulesRef.current) {
      observer.observe(rulesRef.current);
    }

    return () => {
      if (rulesRef.current) {
        observer.unobserve(rulesRef.current);
      }
    };
  }, []);
  const navigate = useNavigate();
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.mainBlock}>
          <div
            className={s.imageBlock}
            onClick={() => navigate("/author")}>
            <img
              src={close}
              alt='closeIcon'
              className={s.closeIcon}
            />
          </div>
          <section>
            <h1 className={s.title}>Условия оферты </h1>
          </section>

          <div className={s.textContent}>
            <p>
              Настоящая Оферта определяет существенные условия
              оказания услуг, использования Заказчиком Сайта{" "}
              <a href='https://makeupdate.online'>
                https://makeupdate.online
              </a>{" "}
              , его ресурсов и сервисов.
            </p>
            <div>
              <h1 className={s.titleElement}>1. ОБЩИЕ ПОЛОЖЕНИЯ</h1>
              <p>
                1.1. Настоящая Оферта (далее - «Оферта») в
                соответствии со ст. 435, п. 2 ст. 437 Гражданского
                кодекса Российской Федерации является официальным
                предложением Общества с ограниченной ответственностью
                «Переменагрупп» (далее – «Исполнитель»), адресованным
                неограниченному кругу юридических лиц, индивидуальных
                предпринимателей или граждан, зарегистрированных в
                качестве самозанятых (далее – «Заказчик») заключить
                договор оказания услуг (далее – «Договор») на
                указанных в Оферте условиях.
              </p>
              <p>
                1.2. В соответствии с п. 3 ст. 438 Гражданского
                кодекса Российской Федерации, акцепт настоящей Оферты
                равносилен заключению Договора на приведенных в Оферте
                условиях.
              </p>
              <p>
                1.3. Акцептом Оферты является осуществление Заказчиком
                полной или частичной оплаты услуг Исполнителя в
                порядке и на условиях, установленных Офертой.
                Совершение указанных действий означает полное и
                безоговорочное принятие Заказчиком всех условий
                настоящего Договора.
              </p>
              <p>
                1.4. Договор оказания услуг по настоящей Оферте
                считается заключенным с момента поступления денежных
                средств на расчетный счет Исполнителя. Заключение
                договора оказания услуг в письменной форме не
                требуется.
              </p>
              <p>
                1.5. Оферта вступает в силу с момента ее размещения на
                сайте Исполнителя{" "}
                <a href='https://makeupdate.online' className={s.gradient}>
                  https://makeupdate.online
                </a>{" "}
              </p>
              <p>
                1.6. Исполнитель оставляет за собой право в любой
                момент по своему усмотрению вносить изменения в
                условия Оферты без предварительного уведомления
                Заказчика. При этом внесенные изменения начинают
                действовать только с момента их опубликования на сайте
                Исполнителя.
              </p>
              <p>
                1.7. Все приложения к Оферте являются ее неотъемлемой
                частью.
              </p>
              <p>
                1.8. Заказчик дает Исполнителю согласие на обработку
                своих персональных данных в соответствии с Политикой
                обработки персональных данных, размещенной на сайте
                Исполнителя по адресу:{" "}
                <a href='https://makeupdate.online/my-documents/policy' className={s.gradient}>
                  https://makeupdate.online/my-documents/policy
                </a>{" "}
                .
              </p>
            </div>
            <div>
              <h1 className={s.titleElement}>2. ПРЕДМЕТ ОФЕРТЫ</h1>
              <p>
                2.1. Исполнитель обязуется оказать Заказчику услуги, а
                Заказчик обязуется оплатить их в размере, порядке и
                сроки, установленные настоящим Договором.
              </p>
              <p>
                2.2. Наименование, объем, состав, продолжительность
                услуг, их стоимость и иные условия опубликованы на
                Сайте Исполнителя.
              </p>
            </div>

            <div>
              <h1 className={s.titleElement}>
                3. ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ
              </h1>
              <p>
                3.1. Сайт – совокупность программ для электронных
                вычислительных машин и иной информации, содержащейся в
                информационной системе, доступ к которой
                осуществляется посредством
                информационно-телекоммуникационной сети «Интернет» по
                доменному адресу{" "}
                <a href='https://makeupdate.online/' className={s.gradient}>
                  https://makeupdate.online/
                </a>{" "}
                .
              </p>
              <p>
                3.2. Заказчик – юридическое лицо, индивидуальный
                предприниматель или гражданин, зарегистрированный в
                качестве самозанятого, использующий Сайт для
                размещения Контента и дальнейшего предоставления
                доступа к нему клиентам. Заказчик является
                правообладателем размещаемого им Контента или наделен
                соответствующими правами в соответствии с действующим
                законодательством Российской Федерации.
              </p>
              <p>
                3.3. Контент – совокупность электронных материалов,
                включая, но не ограничиваясь: текстовую информацию,
                изображения, аудио и видеозаписи, выраженные в форме
                онлайн-уроков, курсов или вебинаров, а также иных
                формах, размещенные Заказчиком на Сайте.
              </p>
              <p>
                3.4. Клиент – физическое или юридическое лицо,
                являющееся пользователем Сайта, изъявившим желание
                приобрести Контент на условиях, установленных
                Заказчиком.
              </p>
              <p>
                3.5. Аккаунт – учетная запись Заказчика,
                представляющая собой совокупность данных, необходимых
                для идентификации Заказчика и использования им
                сервисов Сайта.
              </p>
              <p>
                3.6. Пользователь сайта – физические и юридические
                лица, в том числе Клиенты, имеющее доступ к Сайту и
                использующее его посредством сети «Интернет».
              </p>
              <p>
                3.7. Учетная запись – совокупность данных и защищенных
                страниц Сайта, создаваемых при регистрации
                Пользователя, необходимых для использования ресурсов
                сайта.
              </p>
              <p>
                3.8. Модерация – процесс проверки Контента, работа по
                ограничению и (или) прекращению доступа к Контенту,
                нарушающему нормы действующего законодательства, права
                и законные интересы третьих лиц, не соответствующему
                тематике Сайта.
              </p>
              <p>
                3.9. В Оферте могут содержаться иные понятия и
                термины, не включенные в раздел 3. В этих случаях
                толкование понятий и терминов производится в
                соответствии с текстом и смыслом Договора.
              </p>
            </div>
            <div>
              <h1 className={s.titleElement}>
                4. СТОИМОСТЬ УСЛУГ И ПОРЯДОК РАСЧЕТОВ
              </h1>
              <p>
                4.1. Полная стоимость услуг, их наименование, объем,
                продолжительность и иные условия указаны на сайте
                Исполнителя.
              </p>
              <p>
                4.2. Заказчик оплачивает услуги в соответствии с
                выбранным тарифом в порядке полной предоплаты в момент
                заключения Договора.
              </p>
              <p>
                4.3. Расчеты между Сторонами производятся в рублях
                Российской Федерации путем перечисления денежных
                средств на расчетный счет Исполнителя.
              </p>
              <p>
                4.4. Датой оплаты услуг является день поступления
                денежных средств Заказчика на расчетный счет
                Исполнителя.
              </p>
              <p>
                4.5. При завершении оплаченного периода Заказчику
                продлевается доступ к сервисам Сайта на{" "}
                <span className={s.red} >5 (пять)</span> календарных
                дней, в течение которых Заказчик принимает решение о
                дальнейшем использовании услуг Исполнителя и продлении
                доступа. При этом датой, с которой будет исчисляться
                действие нового тарифного плана, является последний
                день предыдущего оплаченного периода.
              </p>
            </div>
            <div>
              <h1 className={s.titleElement}>
                5. ПОРЯДОК ОКАЗАНИЯ УСЛУГ
              </h1>
              <p>
                5.1. Исполнитель предоставляет Заказчику право
                использовать Сайт, программное обеспечение и иные
                сервисы для размещения Контента с возможностью
                дальнейшего предоставления доступа к такому Контенту
                Пользователям сайта.
              </p>
              <p>
                5.2. Заказчик самостоятельно знакомится с информацией
                об услугах, оказываемых Исполнителем, выбирает тариф и
                выплачивает Исполнителю вознаграждение за
                использование соответствующих сервисов и
                функциональных возможностей Сайта.
              </p>
              <p>
                5.3. Для размещения Контента Заказчику необходимо
                создать Аккаунт и указать достоверные данные о себе.
              </p>
              <p>
                5.4. Заказчик размещает Контент на определенный период
                в зависимости от выбранного тарифного плана. По
                истечении оплаченного периода доступ к Контенту
                ограничивается, а доступ Пользователей к размещенным
                Контенту приостанавливается. Заказчик вправе продлить
                доступ к сервисам Сайта в порядке, установленном
                разделом 4 Договора.
              </p>
              <p>
                5.5. Заказчик самостоятельно несет ответственность за
                сохранение конфиденциальности пароля, используемого
                для доступа к Аккаунту.
              </p>
              <p>
                5.6. Услуга считается оказанной с момента размещения
                Заказчиком Контента на Сайте и обеспечения
                Исполнителем доступа Пользователей к размещенному
                Контенту.
              </p>
              <p>
                5.7. В момент заключения Договора Заказчик
                предоставляет Исполнителю разрешение на использование
                изображений своего товарного знака, скриншотов,
                фрагментов Контента с целью информирования
                Пользователей о содержании Контента. Указанное
                разрешение предоставляется Заказчиком на
                неограниченный срок, без ограничений по территории и
                способам использования.
              </p>
              <p>
                5.8. При заключении возмездных сделок с Клиентом,
                Заказчик самостоятельно выбирает способы осуществления
                расчетов, применяет платежные системы по своему
                усмотрению. Исполнитель не является посредником или
                третьей стороной при совершении сделок между
                Заказчиком и Клиентом, не несет ответственность за
                содержание таких сделок и действия сторон.
              </p>
              <p>
                5.9. Исполнитель вправе по собственному усмотрению
                изменять размер вознаграждения за предоставляемое
                услуги путем изменения тарифных планов. В случае
                изменения тарифного плана Заказчик может согласиться с
                изменениями, выбрать иной тарифный план либо
                отказаться от Договора. Стоимость тарифного плана
                изменению не подлежит до истечения оплаченного
                периода.
              </p>
              <p>
                5.10. Администрация прилагает все усилия для
                обеспечения бесперебойной работы Сайта и его сервисов
                в круглосуточном режиме. Доступ к Сайту может быть
                временно приостановлен в связи с проведением
                технических работ.
              </p>
              <p>
                5.11. На Сайте функционирует служба технической
                поддержки, куда Заказчик может обратиться для
                оперативного решения вопросов и проблем, связанных с
                использованием Сайта.
              </p>
              <p>
                5.12. Исполнитель не несет ответственности за
                достижение Заказчиком экономического или финансового
                результата, который Заказчик рассчитывает получить при
                использовании услуг Исполнителя.
              </p>
              <p>
                5.13. При превышении размера файлового хранилища,
                предоставленных Заказчику в соответствии с выбранным
                тарифным планом, Исполнитель имеет право приостановить
                доступ к Пользователей к Контенту и уведомить
                Заказчика о необходимости изменения тарифного плана.
              </p>
            </div>
            <div>
              <h1 className={s.titleElement}>
                6.ТРЕБОВАНИЯ К КОНТЕНТУ. ИНТЕЛЛЕКТУАЛЬНАЯ
                СОБСТВЕННОСТЬ.
              </h1>
              <p>
                6.1. Заказчик вправе размещать на Сайте Контент по
                тематике создания макияжа. Размещение контента иной
                тематики не допускается. Исполнитель оставляет за
                собой право приостановить доступ Пользователей к
                Контенту, не соответствующему тематике Сайта без
                уведомления Заказчика и возврата денежных средств,
                затраченных на размещение такого контента, его
                хранение и использование ресурсов Исполнителя.
              </p>
              <p>
                6.2. Заказчик гарантирует, что является
                правообладателем размещаемого им Контента или наделен
                соответствующими полномочиями в соответствии с
                действующим законодательством Российской Федерации, а
                содержание Контента не нарушает права и законные
                интересы третьих лиц.
              </p>
              <p>
                6.3. Запрещается размещение Контента, нарушающего
                интеллектуальные и иные права третьих лиц; носящего
                незаконный характер, призывающего к совершению
                противоправных действий; запрещенного к
                распространению на территории Российской Федерации;
                носящего дискриминационный или дискредитирующий
                характер; содержащий вредоносные программы и вирусы.
              </p>
              <p>
                6.4. Заказчик самостоятельно несет ответственность за
                соответствие содержания размещаемого Контента
                требованиям действующего законодательства, включая
                ответственность перед третьими лицами в случаях, когда
                размещение того или иного контента или содержание
                контента нарушает права и законные интересы третьих
                лиц.
              </p>
              <p>
                6.5. Исполнитель не осуществляет предварительную
                модерацию или проверку Контента, размещаемого
                Заказчиком, и не несет ответственности за его
                содержание.
              </p>
            </div>
            <div>
              <h1 className={s.titleElement}>
                7. ПРАВА И ОБЯЗАННОСТИ СТОРОН
              </h1>
              <p style={{ fontWeight: "700" }}>
                7.1. Исполнитель обязуется:
              </p>
              <p>
                7.1.1. Предоставить Заказчику доступ к сервисам Сайта
                согласно выбранному тарифному плану в срок не позднее
                одного рабочего дня с даты исполнения Заказчиком своих
                обязательств по оплате услуг.
              </p>
              <p>
                7.1.2. ООбеспечить постоянный круглосуточный доступ
                Заказчика к сервисам Сайта, незамедлительно принимать
                меры для устранения технических ошибок и
                неисправностей, препятствующих выполнению обязательств
                по Договору.
              </p>
              <p>
                7.1.3. Осуществлять техническую поддержку Заказчика.
              </p>
              <p>
                7.1.4. Обеспечить сохранность персональных данных
                Заказчика, не передавать их третьим лицам, за
                исключением случаев, предусмотренных действующим
                законодательством РФ.
              </p>
              <p style={{ fontWeight: "700" }}>
                7.2. Исполнитель вправе:
              </p>
              <p>
                7.2.1. При обнаружении Контента, нарушающего права и
                законные интересы третьих лиц, а также нормы
                действующего законодательства Российской Федерации,
                приостановить доступ Пользователей к такому Контенту и
                (или) удалить указанный Контент, а также заблокировать
                Аккаунт Заказчика без предварительного уведомления.
              </p>
              <p>
                7.2.2. Использовать скриншоты или фрагменты Контента
                для информирования и привлечения внимания
                Пользователей.
              </p>
              <p>
                7.2.3. Запрашивать у Заказчика документы,
                подтверждающие правомерность его деятельности в части
                исполнения обязательств по настоящему Договору.
              </p>
              <p>
                7.2.4. Привлекать к исполнению обязательств третьих
                лиц. За действия (бездействие) указанных лиц Заказчик
                несет ответственность как за свои собственные.
              </p>
              <p>
                7.2.5. Производить профилактические работы на Сайте с
                временным приостановлением его деятельности по
                возможности в ночное время, максимально сокращая время
                неработоспособности Сайта и его сервисом без
                предварительного уведомления Заказчика.
              </p>
              <p style={{ fontWeight: "700" }}>
                7.3. Заказчик обязуется:
              </p>
              <p>
                7.3.1. Оплатить услуги Исполнителя в соответствии с
                выбранным тарифным планом.
              </p>
              <p>
                7.3.2. Размещать на Сайте контент только по тематике
                создания макияжа.
              </p>
              <p>
                7.3.3. Не размещать Контент, нарушающий права и
                законные интересы третьих лиц.
              </p>
              <p>
                7.3.4. Не передавать доступ к Аккаунту третьим лицам.
              </p>
              <p>
                7.3.5. Самостоятельно обеспечивать технические
                возможности пользования Услугами Исполнителя со своей
                стороны.
              </p>
              <p>
                7.3.6. Самостоятельно знакомиться с изменениями,
                внесенными в настоящую Оферту, тарифные планы и
                Пользовательское соглашение Сайта.
              </p>
              <p style={{ fontWeight: "700" }}>
                7.4. Заказчик вправе:
              </p>
              <p>
                7.4.1. Использовать Сайт и сервисы Исполнителя в
                соответствии с выбранным тарифом любыми способами,
                допустимыми функциональными возможностями Сайта, за
                исключением способов, прямо запрещенных условиями
                использования Сайта и действующим законодательством
                РФ.
              </p>
              <p>
                7.4.2. Самостоятельно устанавливать условия
                предоставления доступа к Контенту, условия заключения
                сделок с Клиентами и пользователями Сайта.
              </p>
              <p>
                7.4.3. При совершении возмездных сделок с Клиентом по
                своему усмотрению выбирать удобные способы оплаты,
                платежные и иные системы.
              </p>
              <p>
                7.4.4. В случае возникновения сомнений относительно
                тематики размещаемого Контента, Заказчик вправе
                обратиться в службу технической поддержки Исполнителя
                для предварительной проверки Контента на предмет его
                соответствия тематики Сайта.
              </p>
            </div>
            <div>
              <h1 className={s.titleElement}>
                8. ОТВЕТСТВЕННОСТЬ СТОРОН И РАЗРЕШЕНИЕ СПОРОВ
              </h1>
              <p>
                8.1. Стороны несут ответственность за неисполнение или
                ненадлежащее исполнение своих обязательств по Договору
                в соответствии с действующим законодательством
                Российской Федерации.
              </p>
              <p>
                8.2. Исполнитель не несет ответственности за
                невозможность оказания услуг, если такая невозможность
                возникла вследствие нарушения работы сети «Интернет»,
                программного обеспечения или оборудования Заказчика.
              </p>
              <p>
                8.3. Стороны признают приоритетным досудебный порядок
                разрешения споров.
              </p>
              <p>
                8.4. В случае невозможности разрешения споров путем
                переговоров, Стороны, после реализации предусмотренной
                законодательством РФ процедуры досудебного
                урегулирования разногласий, передают их на
                рассмотрение в суд по месту нахождения Исполнителя.
              </p>
              <p>
                8.5. Стороны освобождаются от ответственности за
                частичное или полное неисполнение обязательств по
                настоящему Договору, если ненадлежащее исполнение
                обязательств вызвано действиями непреодолимой силы, то
                есть чрезвычайными и непредотвратимыми
                обстоятельствами, возникшими помимо воли и желания
                Сторон и которые нельзя было заранее предвидеть и
                предотвратить.
              </p>
            </div>

            <div>
              <h1 className={s.titleElement}>
                9. СРОК ДЕЙСТВИЯ И ПОРЯДОК РАСТОРЖЕНИЯ ДОГОВОРА
              </h1>
              <p>
                9.1. Договор вступает в силу с момента оплаты
                Заказчиком услуг Исполнителя способами, указанными в
                настоящей Оферте, и действует до полного исполнения
                Сторонами своих обязательств.
              </p>
              <p>
                9.2. Если тарифный план на новый период не будет
                продлен и оплачен Заказчиком в течение{" "}
                <span className={s.red}>5 (пяти)</span> календарных
                дней после истечения срока действия приобретенного
                ранее тарифа, действие Договора прекращается.
              </p>
              <p>
                9.3. В случае возникновения у Исполнителя
                обстоятельств, препятствующих исполнению обязательств
                по Договору, он обязуется возвратить Заказчику
                уплаченное ранее вознаграждение за вычетом фактически
                понесенных расходов.
              </p>
              <p>
                9.4. Заказчик вправе расторгнуть Договор в
                одностороннем порядке. В случае отказа Заказчика от
                исполнения обязательств по Договору в одностороннем
                порядке, Исполнитель не производит возврат стоимости
                оплаченных услуг.
              </p>
              <p>
                9.5. В случае досрочного расторжения Договора по
                инициативе Исполнителя в связи с нарушением Заказчиком
                своих обязательств, предусмотренных настоящим
                Договором, сумма оплаченного тарифного плана возврату
                не подлежит.
              </p>
            </div>
            <div className={s.requisites}>
              <h1 className={s.titleElement}>
                10. РЕКВИЗИТЫ ООО «ПЕРЕМЕНАГРУПП»
              </h1>
              <p>ООО "ПЕРЕМЕНАГРУПП"</p>
              <p>
                Юридический адрес 354068, КРАСНОДАРСКИЙ КРАЙ, Г.О.
                ГОРОД-
              </p>
              <p>КУРОРТ СОЧИ, Г СОЧИ, УЛ ДОНСКАЯ, Д. 10,</p>
              <p>ПОМЕЩ. 30, ОФИС 401-Ф</p>
              <p>ИНН 2366050487</p>
              <p>КПП 236601001</p>
              <p>ОГРН 1242300048825</p>
              <p>ФИЛИАЛ "ЦЕНТРАЛЬНЫЙ" БАНКА ВТБ (ПАО)</p>
              <p>БИК 044525411</p>
              <p>Корреспондентский счет 30101810145250000411</p>
              <p>Расчетный счет 40702810106420002423</p>
            </div>

            <div className={s.rules} ref={rulesRef}>
              <button
                type='button'
                className={isCheck ? s.checked : s.buttonCheckbox}
                onClick={() => setIsCheck(!isCheck)}>
                {isCheck && (
                  <img
                    onClick={() => setIsCheck(!isCheck)}
                    src={checkedIcon}
                    alt='checkedIcon'
                    className={s.checkedIcon}
                  />
                )}
              </button>
              <span>Я принимаю условия оферты</span>
            </div>
            {isCheck && (
              <div className={s.bottomContainer}>
                <div className={s.selectedTariff}>
                  <span className={s.titleTariff}>
                    Выбранный тариф
                  </span>
                  <p className={s.tariff}>
                    <span className={s.author}>AUTHOR</span>{" "}
                    <span
                      className={
                        s.name
                      }>{`(${gb}ГБ / ${minutes} часов)`}</span>
                  </p>
                </div>
                <div className={s.payment}>
                  <span className={s.paymentMethodTitle}>
                    Способ оплаты
                  </span>
                  <div className={s.paymentSelect}>
                    <div className={s.paymentMethod}>
                      Master card...7389
                    </div>
                    <div className={s.paymentMethod}>
                      Master card...7389
                    </div>
                    <div className={s.paymentMethod}>
                      Master card...7389
                    </div>
                    <div className={s.paymentMethod}>
                      Master card...7389
                    </div>
                  </div>
                </div>
                <div className={s.buttonContainer}>
                  <button className={s.paymentButton}>
                    <span>Перейти к оплате</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showScrollIcon && (
        <img
          src={scrollIcon}
          alt='scroll'
          className={s.scrollIcon}
          onClick={scrollToElement}
        />
      )}
    </div>
  );
};
