export interface Icon {
  color: string;
}

// Auth type

export interface Register {
  email: any;
  telegram: any;
  password: any;
}

// User type
export interface User {
  name: string;
  location: any;
  videoNum: number;
  viewNum: number;
}

// ModalWindow
export interface ModalAuth {
  isOpen: boolean;
  onClose: () => void;
}

export interface OpenAuth {
  isAuthenticated: boolean;
  openAuthModal: () => void;
}

// ModalBurger
export interface ModalUser {
  isOpen: boolean;
  onClose: () => void;
}

export interface HeaderButton {
  openModal: () => void;
}
//

export interface firstName {
  value: string;
  onChange: (value: string) => void;
}

export interface secondaryName {
  value: string;
  onChange: (value: string) => void;
}

export interface ILocation {
  value: string;
  onChange: (value: string) => void;
}

export interface openInfo {
  open: boolean;
  isOpen: boolean;
}

// Authorized

export interface IUserData {
  email: string;
  password: string;
  telegram: string;
  whatsapp: string;
  lang: string;
}

export interface IResponseUser {
  refresh: string;
  access: string;
}
export interface IRefresh {
  access: string;
}

export interface IResponseUserData {
  email: string;
  telegram?: any;
  password: string;
  whatsapp: string;
  lang: string;
}

export interface IUser {
  email: string;
  password: string;
  telegram?: string;
  whatsapp?: string;
  lang?: string;
}
export interface ISearchData {
  first_name: string;
  last_name: string;
  lat_first_name: string;
  lat_last_name: string;
  country: string;
  city: string;
  photo: string;
  user_id: number;
}

export interface IConfirm {
  uid: string;
  token: string;
}

export interface IGetUserData {
  city: string;
  country: string;
  description: string;
  first_name: string;
  lat_first_name: string;
  lat_last_name: string;
  last_name: string;
  phone: string;
  photo: string;
  show_telegram: boolean;
  show_telephone: boolean;
  show_whats_app: boolean;
  telegram: string;
  user_id: number;
  followers_count: number;
  following_count: number;
  whats_app: string;
}

export interface IMinimalUserData {
  first_name: string;
  last_name: string;
  photo: string;
  user_id: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IProfileMobileProps {
  photoLink: string;
  name: string;
  last_name: string;
  description: string;
  city: string;
  country: string;
}

export interface InputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  icon?: string;
  isPassword?: boolean;
  isVisible?: boolean;
  onVisibilityToggle?: any;
}
export interface InputsProps {
  onInputChange: (field: string, value: string | boolean) => void;
  initialFirstName?: string;
  initialLastName?: string;
  initialCity?: string;
  initialCountry?: string;
  initialTelegram?: string;
  initialPhone?: string;
  initialShowPhone: boolean;
  initialShowTelegram: boolean;
  initialShowWhatsapp: boolean;
}

export interface IInitialStateAuth {
  email: string;
  telegram: string;
  password: string;
  confirmPassword: string;
  isLogin: boolean;
  isConfirmEmail: boolean;
  isChecked: boolean;
  whatsapp: string;
  isSendEmail: boolean;
  seconds: number;
}

export interface IInputData {
  first_name: string;
  last_name: string;
  city: string;
  country: string;
  telegram: string;
  phone: string;
  show_telegram: boolean;
  show_telephone: boolean;
}
export interface IFollowers {
  count: number;
  next: number | null;
  previous: number | null;
  results: [
    {
      first_name: string;
      last_name: string;
      country: string;
      city: string;
      photo: string;
      user_id: 23;
    },
  ];
}
export interface IFollower {
  first_name?: string;
  last_name?: string;
  lat_first_name?: string;
  lat_last_name?: string;
  country?: string;
  city?: string;
  photo?: string;
  user_id?: number;
}
export interface ISmallCardProps {
  userData: IFollower;
}

export interface IPropsUsers {
  userData: IFollower;
  totalViews?: number;
  countLessons?: number;
}

export interface INavigationProps {
  followersCount?: number;
}
export interface IProfileData {
  first_name: string;
  last_name: string;
  lat_first_name: string;
  lat_last_name: string;
  country: string;
  city: string;
  description: string;
  photo: string;
  phone: string;
  user_id: number;
  is_subscribed?: boolean;
  telegram: string;
  whatsapp?: string;
  followers_count: number;
  following_count: number;
  show_whats_app: boolean;
}
export interface IInitialStateProfileCard {
  isEditing: boolean;
  isSaving: boolean;
  description: string;
  profileData: IProfileData | null;
  subscribe: boolean;
  followers: IFollowers | null;
  following: IFollowers | null;
  counter: ICounter[] | null;
  myProfileCounter: IGetMyProfileCounter | null;
  openPublished: boolean;
  openCreateModal: boolean;
  boughtVideo: ILessonsState | null;
  offsets: { [key: string]: number };
  typeUser: { type: string; m: number; gb: number };
  accessControl: IAccessControlState | null;
}

export interface IHeaderState {
  activeLink: string | null;
  language: string;
  isModalOpen: boolean;
  isArrowUp: boolean;
}

export interface ILanguageIconList {
  type: string;
  img: string;
  label: string;
}
export interface ILanguageState {
  language: string;
}

export interface ILesson {
  id: number;
  user_id?: number;
  title: string;
  description: string;
  price?: number;
  views: number;
  duration: number;
  published_date: string;
  count_comments: number;
  until_date: string;
  is_favorite?: boolean;
  poster_url: string;
  all_lang: false;
  published?: boolean;
  is_public?: boolean;
}
export interface ILessonsState {
  count?: number;
  next: string | null;
  previous?: null;
  results: ILesson[];
}
export interface IAccessControlState {
  count?: number;
  next: string | null;
  previous?: null;
  results: IAccessControlRes[];
}
export interface IAccessControlRes {
  id: number;
  title: string;
  user_id: number;
  access_until: string;
  created_at: string;
  status: boolean;
  media_id: number;
}

export interface IMyLessonsState {
  count?: number;
  next: string;
  previous?: null;
  results: IMyLesson[];
}

export interface IMyLesson {
  id: number;
  title: string;
  all_lang: false;
  views: number;
  count_comments: number;
  description: string;
  duration: number;
  published: boolean;
  published_date: string;
  poster_url: string;
  until_date: string;
}
export interface IInitialStateLessons {
  lessons: ILessonsState | null;
  myLessons: IMyLessonsState | null;
  profiles: Record<number, IProfileData | null>;
  activeFilter: "popularity" | "hi";
  userLesson: ILessonsState | null;
  favouriteLessonsList: ILessonsState | null;
  usersProfiles: IGetUsersProfiles[] | null;
  usersProfilesUsersPage: IGetUsersProfiles[] | null;
  isFavourite: {
    detail: string;
  } | null;
  blacklist: number[];
  popularityList: ILessonsState | null;
  dateList: ILessonsState | null;
  sellerTarif: ITarifPayload[];

  offsets: {
    popularity: number; // offset для сортировки по популярности
    hi: number; // offset для сортировки по дате
  };
  openComplaint: boolean;
  postComplaintModal: boolean;
  openEditLesson: boolean;
}
export interface ITarifPayload {
  id: number;
  title: string;
  price: number;
  gigo_bytes: number;
  minutes: number;
  tarif_type: string;
}

export interface IProfilePayload {
  user_id: number;
  profile: IProfileData | null;
}

export interface LessonProps {
  lessonData?: ILesson;
  profileData?: IProfileData | IGetUsersProfiles | null;
  currentId?: number;
  onBlacklist?: () => void;
}

export interface IHomeLessonProps {
  lessonData: ILessonHomePageResults;
  profileData?: IProfileData | IGetUsersProfiles | null;
}
export interface ICounter {
  user_id: number;
  total_views: number;
  count_lessons: number;
}

export interface IUsersProfiles {
  first_name: string;
  last_name: string;
  lat_first_name: string;
  lat_last_name: string;
  country: string;
  city: string;
  photo: string;
  user_id: number;
}

export interface IGetUsersProfiles {
  first_name: string;
  last_name: string;
  lat_first_name: string;
  lat_last_name: string;
  country: string;
  city: string;
  photo: string;
  user_id: number;
}

export interface IGetUsers {
  count: number;
  next: null;
  previous: null;
  results: IGetUsersInitialState[];
}
export interface IGetUsersInitialState {
  user_id: number;
  total_views: number;
  count_lessons: number;
}

export interface IUsersInitialState {
  maxViewsUsers: IGetUsers | null;
  withOutVideoUsers: IGetUsersWithOutVideo | null;
}

export interface IGetUsersWithOutVideo {
  count: number;
  next: null;
  previous: null;
  results: IUserWithOutVideo[];
}
export interface IUserWithOutVideo {
  first_name: string;
  last_name: string;
  country: string;
  city: string;
  description: string;
  photo: string;
  phone: string;
  show_telegram: boolean;
  show_telephone: boolean;
  user_id: number;
  telegram: string;
}

export interface IGetMyProfileCounter {
  favorite_count: number;
  purchase_count: number;
}

export interface IGetPlayerIdInitialState {
  playerData: IPlayerDataState | null;
  playerCommentData: IPlayerCommentState | null;
  repliesByCommentId: Record<
    number,
    IPlayerCommentDataRepliesResults[]
  >;
}
export interface IPlayerDataState {
  count_comments: number;
  description: string;
  id: number;
  is_favorite: boolean;
  media_id: string;
  price: number;
  published_date: string;
  title: string;
  views: number;
  poster_url: string;
  user_id: number;
  is_public: boolean;
  conditions: [
    {
      id: number;
      text: string;
      link: string;
    },
  ];
}
export interface IPlayerCommentState {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: IPlayerCommentDataResults[];
}
export interface IPlayerCommentDataResults {
  id: number;
  user_id: number;
  text: string;
  created_at: Date;
  reply_count: number;
}

export interface ICommentProps {
  commentData: IPlayerCommentDataResults;
  profileData?: IProfileData | IGetUsersProfiles | null;
}

export interface IPlayerCommentRepliesState {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: IPlayerCommentDataRepliesResults[];
}
export interface IPlayerCommentDataRepliesResults {
  id: number;
  user_id: number;
  text: string;
  created_at: string;
}

export interface IPlayerSendComment {
  id: number;
  user_id: number;
  text: string;
  media_id: number;
  created_at: string;
  parent_comment_id: null;
}

export interface IHomeState {
  lessonCounter: number;
  userCounter: number;
  activeTab: "news" | "manual" | "support" | "FAQ";
  openDoc: boolean;
  isOpenDocList: boolean;
  openProtection: boolean;
  isOpenList: boolean;
  homeLessonsList: ILessonsHomePageState | null;
  manualCategory: IManualCategories[] | [];
  manualCategoryListOne: IManualCategoryElement[] | [];
  openCategoryIndex: number | null;
  optionListHeight: number | null;
  faqInformation:
    | [
        {
          id: number;
          description: string;
          title: string;
        },
      ]
    | [];
}
export interface IManualCategories {
  id: number;
  title: string;
}
export interface IManualCategoryElement {
  id: number;
  slug: string;
  title: string;
  description: string;
}

export interface IRefProps {
  data?: IManualCategories;
  state?: 1 | 2;
  scrollToSection?: (ref: React.RefObject<HTMLDivElement>) => void;
  registrationRef?: React.RefObject<HTMLDivElement>;
  settingProfileRef?: React.RefObject<HTMLDivElement>;
  selectTutorialsRef?: React.RefObject<HTMLDivElement>;
  paymentRef?: React.RefObject<HTMLDivElement>;
  loadingTutorialsRef?: React.RefObject<HTMLDivElement>;
  socialRef?: React.RefObject<HTMLDivElement>;
  reviewsRef?: React.RefObject<HTMLDivElement>;
  supportsRef?: React.RefObject<HTMLDivElement>;
  drmRef?: React.RefObject<HTMLDivElement>;
  watermarkRef?: React.RefObject<HTMLDivElement>;
  optionListRef?: React.RefObject<HTMLUListElement>;
  refs?: Record<string, React.RefObject<HTMLDivElement>>;
  updateHeight?: () => void;
  selectedOption?: IManualCategoryElement | null;
  updateSelectedOption?: (option: IManualCategoryElement) => void;
}

export interface IBurgerState {
  profiles: IMinimalUserData[];
  activeProfile: string | null;
}

export interface IProfilesData {
  first_name: string;
  last_name: string;
  photo: string;
  user_id: string;
  accessToken: string;
  refreshToken: string;
}

export interface ICreateLessonState {
  nameLesson: string | null;
  descriptionLesson: string | null;
  videoDuration: number | null;
  imageSrc: string | null;
  imageFile: File | null;
  videoStatus: IGetStatus | null;
  voiceGender: "male" | "female";
  lessonLoadLink: string | null;
  videoSize: number | null;
  videoSrc: string | null;
  videoFile: File | null;
  currentStep: 1 | 2 | 3;
  markUploaded: boolean;
  isLoad: boolean;
  is_public: boolean;
  published: boolean;
}

export interface IConditionsState {
  conditions: ICondition[];
}
export interface ICondition {
  text: string;
  link: string;
  isOpen: boolean;
}

export interface IAuthorState {
  gb: number;
  minutes: number;
  openOffer: boolean;
}

export interface INavigationModalState {
  isModalOpen: boolean;
  isAuthOpen: boolean;
}
export interface IUploadLinkResponse {
  detail: {
    url: string;
  };
}

export interface IGetStatus {
  status: string;
  progress: number;
  video_status: string;
  media_id: string;
}

export interface ILessonsHomePageState {
  count: number;
  next: string | null;
  previous?: string | null;
  results: ILessonHomePageResults[];
}
export interface ILessonHomePageResults {
  id: 1;
  title: string;
  description: string;
  poster_url: string;
  count_comments: number;
  user_id: number;
  price: number;
  views: number;
  duration: number;
  published_date: string;
  untill_date: number | null;
  is_favorite: boolean;
  all_lang: boolean;
}

export interface ITranslateState {
  translatedName: Record<number, string>;
  translatedLocation: Record<number, string>;
  translatedVideoName: Record<number, string>;
  translatedDescription: Record<number, string>;
}
export interface ILoadMoreParams {
  dispatch: any; // dispatch для Redux
  next: string; // URL для следующей страницы
  action: (data: any) => void; // Redux action для обработки данных
  lesson?: boolean;
}

export interface IChangeNameFormState {
  new_first_name: string;
  new_last_name: string;
  reason: string;
}
