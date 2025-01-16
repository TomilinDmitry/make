import home from "../../../app/assets/other/home.svg";
import homeActive from "../../../app/assets/other/homeActive.svg";
import lessons from "../../../app/assets/other/Lessons.svg";
import lessonsActive from "../../../app/assets/other/LessonsActive.svg";
import users from "../../../app/assets/other/people.svg";
import usersActive from "../../../app/assets/other/peopleActive.svg";
import events from "../../../app/assets/other/events.svg";
import eventsActive from "../../assets/other/EventActive.svg";
import rus from "../../../app/assets/language/Russia.svg";
import uk from "../../../app/assets/language/UK.svg";
import spain from "../../../app/assets/language/Spain.svg";
import UAE from "../../../app/assets/language/Saud.svg";
import turkey from "../../../app/assets/language/Turkey.svg";
import germany from "../../../app/assets/language/Germany.svg";
import france from "../../../app/assets/language/France.svg";
import italy from "../../app/../assets/language/Italy.svg";
import korea from "../../../app/assets/language/SouthKorea.svg";
import china from "../../../app/assets/language/China.svg";
import { ILanguageIconList } from "app/types/type";
interface TranslationLinks {
  to: string;
  img: string;
  img_active: string;
  label: string;
}

interface Translation {
  title: string;
  links: TranslationLinks[];
}

type Translations = Record<string, Translation>;

export const translations: Translations = {
  RU: {
    title: "MAKEUPDATE",
    links: [
      {
        to: "/",
        img: home,
        img_active: homeActive,
        label: "Главная",
      },
      {
        to: "/lessons",
        img: lessons,
        img_active: lessonsActive,
        label: "Уроки",
      },
      {
        to: "/users",
        img: users,
        img_active: usersActive,
        label: "Пользователи",
      },
      {
        to: "/events",
        img: events,
        img_active: eventsActive,
        label: "События",
      },
    ],
  },
  EN: {
    title: "MAKEUPDATE",
    links: [
      { to: "/", img: home, img_active: homeActive, label: "Home" },
      {
        to: "/lessons",
        img: lessons,
        img_active: lessonsActive,
        label: "Tutorials",
      },
      {
        to: "/users",
        img: users,
        img_active: usersActive,
        label: "Users",
      },
      {
        to: "/events",
        img: events,
        img_active: eventsActive,
        label: "Events",
      },
    ],
  },
  ES: {
    title: "MAKEUPDATE",
    links: [
      { to: "/", img: home, img_active: homeActive, label: "Inicio" },
      {
        to: "/lessons",
        img: lessons,
        img_active: lessonsActive,
        label: "Lecciones",
      },
      {
        to: "/users",
        img: users,
        img_active: usersActive,
        label: "Usuarios",
      },
      {
        to: "/events",
        img: events,
        img_active: eventsActive,
        label: "Eventos",
      },
    ],
  },
  AE: {
    title: "MAKEUPDATE",
    links: [
      {
        to: "/",
        img: home,
        img_active: homeActive,
        label: "الرئيسية",
      },
      {
        to: "/lessons",
        img: lessons,
        img_active: lessonsActive,
        label: "الدروس",
      },
      {
        to: "/users",
        img: users,
        img_active: usersActive,
        label: "المستخدمون",
      },
      {
        to: "/events",
        img: events,
        img_active: eventsActive,
        label: "الفعاليات",
      },
    ],
  },
  KR: {
    title: "MAKEUPDATE",
    links: [
      {
        to: "/",
        img: home,
        img_active: homeActive,
        label: "홈",
      },
      {
        to: "/lessons",
        img: lessons,
        img_active: lessonsActive,
        label: "수업",
      },
      {
        to: "/users",
        img: users,
        img_active: usersActive,
        label: "사용자",
      },
      {
        to: "/events",
        img: events,
        img_active: eventsActive,
        label: "이벤트",
      },
    ],
  },
  CH: {
    title: "MAKEUPDATE",
    links: [
      { to: "/", img: home, img_active: homeActive, label: "家" },
      {
        to: "/lessons",
        img: lessons,
        img_active: lessonsActive,
        label: "教训",
      },
      {
        to: "/users",
        img: users,
        img_active: usersActive,
        label: "用户",
      },
      {
        to: "/events",
        img: events,
        img_active: eventsActive,
        label: "活动",
      },
    ],
  },
  TR: {
    title: "MAKEUPDATE",
    links: [
      { to: "/", img: home, img_active: homeActive, label: "Ev" },
      {
        to: "/lessons",
        img: lessons,
        img_active: lessonsActive,
        label: "Dersler",
      },
      {
        to: "/users",
        img: users,
        img_active: usersActive,
        label: "Kullanıcılar",
      },
      {
        to: "/events",
        img: events,
        img_active: eventsActive,
        label: "Etkinlikler",
      },
    ],
  },
  DE: {
    title: "MAKEUPDATE",
    links: [
      { to: "/", img: home, img_active: homeActive, label: "Haus" },
      {
        to: "/lessons",
        img: lessons,
        img_active: lessonsActive,
        label: "Lehren",
      },
      {
        to: "/users",
        img: users,
        img_active: usersActive,
        label: "Internetnutzer",
      },
      {
        to: "/events",
        img: events,
        img_active: eventsActive,
        label: "Anl",
      },
    ],
  },
  FR: {
    title: "MAKEUPDATE",
    links: [
      {
        to: "/",
        img: home,
        img_active: homeActive,
        label: "Accueil",
      },
      {
        to: "/lessons",
        img: lessons,
        img_active: lessonsActive,
        label: "Tutoriels",
      },
      {
        to: "/users",
        img: users,
        img_active: usersActive,
        label: "Utilisateurs",
      },
      {
        to: "/events",
        img: events,
        img_active: eventsActive,
        label: "Événements",
      },
    ],
  },
  IT: {
    title: "MAKEUPDATE",
    links: [
      { to: "/", img: home, img_active: homeActive, label: "Casa" },
      {
        to: "/lessons",
        img: lessons,
        img_active: lessonsActive,
        label: "Lezione",
      },
      {
        to: "/users",
        img: users,
        img_active: usersActive,
        label: "Internauti",
      },
      {
        to: "/events",
        img: events,
        img_active: eventsActive,
        label: "Evento",
      },
    ],
  },
};

export const languageIconList: ILanguageIconList[] = [
  {
    type: "RU",
    img: rus,
    label: "Русский",
  },
  {
    type: "EN",
    img: uk,
    label: "English",
  },
  {
    type: "ES",
    img: spain,
    label: "Español",
  },
  {
    type: "AE",
    img: UAE,
    label: "عربي",
  },
  {
    type: "KR",
    img: korea,
    label: "한국인",
  },
  {
    type: "CH",
    img: china,
    label: "中國人",
  },
  {
    type: "TR",
    img: turkey,
    label: "Türkçe",
  },
  {
    type: "DE",
    img: germany,
    label: "Deutsch",
  },
  {
    type: "FR",
    img: france,
    label: "Français",
  },
  {
    type: "IT",
    img: italy,
    label: "Italiano",
  },
];

export const languageImages = {
  ru: rus,
  en: uk,
  es: spain, // и так далее для других языков
  ae: UAE,
  sk: korea,
  ch: china,
  tr: turkey,
  de: germany,
  fr: france,
  it: italy,
};
