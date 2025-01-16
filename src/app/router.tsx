import { Route, Routes, useLocation } from "react-router-dom";
import { Confirm } from "../pages/Confirm/Confirm";
import { Error } from "../components/ErrorPage/Error";
import { Home } from "../pages/Home/Home";
import { Lessons } from "../pages/Lessons/Lessons";
import { Profile } from "../pages/MyProfile/Profile";
import { Users } from "../pages/Users/Users";
import { Menu } from "../Menu/Menu";
import { AuthForm } from "components/AuthForm/AuthForm";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import { Events } from "pages/Events/Events";
import { ProfileUsers } from "pages/ProfileUsers/ProfileUsers";
import { LessonPlayer } from "pages/LessonPlayer/LessonPlayer";
import { Seller } from "pages/Seller/Seller";
import { Manual } from "components/HomeComponent/MainContent/Navigation/Manual/Manual";
import { FAQ } from "components/HomeComponent/MainContent/Navigation/FAQ/FAQ";
import { Support } from "components/HomeComponent/MainContent/Navigation/Support/Support";
import { Reset } from "pages/Reset/Reset";
import { OfferModal } from "components/SellerUi/offerModal/OfferModal";

function AppRouter({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const location = useLocation();
  const backgroundLocation =
    location.state?.backgroundLocation || location;

  return (
    <Routes location={backgroundLocation}>
      <Route path='/' element={<Home />}>
        <Route path='my-documents/' element={<Manual />} />
        <Route path='my-documents/:slug' element={<Manual />} />
        <Route path='FAQ' element={<FAQ />} />
        <Route path='support' element={<Support />} />
      </Route>
      <Route path='/login' element={<AuthForm />} />
      <Route path='/lessons' element={<Lessons />} />
      <Route path='/events' element={<Events />} />
      <Route path='/confirmEmail/:uid/:token' element={<Confirm />} />
      <Route path='/resetPassword/:uid/:token' element={<Reset />} />

      <Route path='*' element={<Error />} />
      <Route path='/users' element={<Users />} />
      <Route path='/menu' element={<Menu />} />
      <Route path='/profile/:id' element={<ProfileUsers />} />
      <Route path='/lesson/:idLesson' element={<LessonPlayer />} />
      <Route path='/author' element={<Seller />} />
      <Route path='/author/offer' element={<OfferModal />} />
      <Route
        element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route path='/profile' element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
