import { Routes, Route, useNavigate } from 'react-router-dom'
import React from "react";
import {api}  from '../utils/Api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithSubmit from "./PopupWithSubmit";
import Register from "./Register";
import Logina from "./Logina";
import InfoTooltipTrue from "./InfoTooltipTrue";
import InfoTooltipFalse from "./InfoTooltipFalse";
import ProtectedRoute from "./ProtectedRoute";
import {auth} from "../utils/Auth";

function App() {
  const[isEditProfilePopupOpen, switchIsEditProfilePopupOpen] = React.useState(false);
  const[isAddPlacePopupOpen, switchIsAddPlacePopupOpen] = React.useState(false);
  const[isEditAvatarPopupOpen, switchIsEditAvatarPopupOpen] = React.useState(false);
  const[isPopupWithSubmit, switchIsPopupWithSubmit] = React.useState(false);
  const[isInfoTooltipFalseOpen, switchIsInfoTooltipFalseOpen] = React.useState(false);
  const[isInfoTooltipTrueOpen, switchIsInfoTooltipTrueOpen] = React.useState(false);

  const[selectedCard, switchSelectCard] = React.useState({open: false, dataCard: {}});
  const[currentUser, setCurrentUser] = React.useState({});
  const[cards, setCards] = React.useState([]);
  const[dataCardDelete, setDataCardDelete] = React.useState('');
  const[userEmail, setUserEmail] = React.useState('');
  const[loginVerification, setLoginVerification] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if(loginVerification === true) {
      navigate('/');
    }
  },[loginVerification]);

  React.useEffect(() => {
    handleChekToken()  //
  },[]);

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getAllCards()])
      .then(([dataInfoUser, dataInfoCard]) => {
        setCurrentUser(dataInfoUser);
        setCards(dataInfoCard);
      })
      .catch((err) => console.log("ошибка получения данных: " + err))
  }, []);

  function handlePatchUserInfo(data) {
    api.patchUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData)
        closePopup()
      })
      .catch((err) => console.log("ошибка данных пользователя: " + err))
  }

  function handleCardLike(data) {
    const isLiked = data.likes.some((i) => i._id === currentUser._id);
    api.changeLikeCardStatus(data._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((card) => (card._id === data._id ? newCard : card)));
      })
      .catch((err) => console.log("ошибка лайка: " + err))
  }

  function handleCardDelete(id) {
    api.deleteCard(id)
      .then(setCards((cards) => cards.filter((card) => id !== card._id),
      closePopup()))
      .catch((err) => console.log("ошибка удаленения карточки: " + err))
  }

  function handleUpdateAvatar(data) {
    api.uploadAvatar(data)
      .then((newData) => {
        setCurrentUser(newData)
        closePopup()
      })
      .catch((err) => console.log("ошибка аватара: " + err))
  }

  function handleAddCard(data) {
    api.postNewCard(data)
      .then((newData) => {
        setCards([newData, ...cards]);
        closePopup()
      })
      .catch((err) => console.log("ошибка карточки: " + err))
  }

  function handleRegister(password, email) {
    auth.registration({
      password: password,
      email: email
    })
      .then(() => {
        navigate('/');
        switchInfoTooltipTrue();
      })
      .catch((err) => {
        switchInfoTooltipFalse();
        console.log("ошибка регистрации пользователя: " + err);
      });
  }

  function handleLogin(password, email) {
    auth.authorization({
      password: password,
      email: email
    })
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setLoginVerification(true);
        }
      })
      .catch((err) => {
        switchInfoTooltipFalse();
        console.log("ошибка авторизации пользователя: " + err);
      });
  }

  function handleChekToken() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.chekToken()
        .then((res) => {
          setLoginVerification(true)
          setUserEmail(res.data.email);
        })
        .catch((err) => console.log("ошибка проверки токена: " + err))
    }
  }

  console.log(userEmail)

  function switchProfilePopup () {
    switchIsEditProfilePopupOpen(true);
  }

  function switchPlacePopup () {
    switchIsAddPlacePopupOpen(true);
  }

  function switchAvatarPopup () {
    switchIsEditAvatarPopupOpen(true);
  }

  function switchPopupWithSubmit (data) {
    switchIsPopupWithSubmit(true);
    setDataCardDelete(data)
  }

  function switchImagePopup(data){
    switchSelectCard({open: true, dataCard: data});
  }

  //Переключение уведомлений
  function switchInfoTooltipFalse() {
    switchIsInfoTooltipFalseOpen(true);
  }

  function switchInfoTooltipTrue() {
    switchIsInfoTooltipTrueOpen(true);
  }

  const closePopup = () => {
    switchIsEditProfilePopupOpen(false)
    switchIsAddPlacePopupOpen(false)
    switchIsEditAvatarPopupOpen(false)
    switchIsPopupWithSubmit(false)
    switchIsInfoTooltipFalseOpen(false)
    switchIsInfoTooltipTrueOpen(false)
    switchSelectCard({open: false, dataCard: {}});
  }

  function clickPopupEsp(e) {
    if(e.keyCode === 27) {
      closePopup();
    }
  }

  function closePopupEsp(popup) {
    if(popup === true) {
      document.addEventListener('keydown', clickPopupEsp)
    }
  }

  function logoutLogin() {
    setLoginVerification(false);
    navigate('/sign-in');
    localStorage.removeItem('jwt');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <InfoTooltipFalse isOpen={isInfoTooltipFalseOpen} onClose={closePopup}/>
      <InfoTooltipTrue isOpen={isInfoTooltipTrueOpen} onClose={closePopup} />
      <Routes>
        <Route path="/sign-up" element={
          <>
            <Header title="Войти" link="/sign-in"/>
            <Register handleRegister={handleRegister} />
          </>}
        />
        <Route path="/sign-in" element={
          <>
            <Header title="Регистрация" link="/sign-up"/>
            <Logina handleLogin={handleLogin}/>
          </>}
        />
        <Route path="/" element={
          <ProtectedRoute loginVerification={loginVerification}>
            <div className="page">
              <Header link="/sign-in" title="Выйти" userEmail={userEmail} logoutLogin={logoutLogin}/>
              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closePopup}
                onUpdateUser={handlePatchUserInfo}
                closePopupEsp={closePopupEsp}>
              </EditProfilePopup>
              <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closePopup}
                onUpdateAvatar={handleUpdateAvatar}
                closePopupEsp={closePopupEsp}>
              </EditAvatarPopup>
              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closePopup}
                handleAddCard={handleAddCard}
                closePopupEsp={closePopupEsp}>
              </AddPlacePopup>
              <ImagePopup
                data={selectedCard}
                onClose={closePopup}
                closePopupEsp={closePopupEsp}/>
              <PopupWithSubmit
                isOpen={isPopupWithSubmit}
                onClose={closePopup}
                handleDeleteClick={handleCardDelete}
                dataCard={dataCardDelete}
                closePopupEsp={closePopupEsp}>
              </PopupWithSubmit>
              <Main
                handleEditProfileClick={switchProfilePopup}
                handleEditAvatarClick={switchAvatarPopup}
                handleAddPlaceClick={switchPlacePopup}
                handlePopupImage={switchImagePopup}
                handlePopupWithSubmit={switchPopupWithSubmit}
                cards={cards}
                onCardClick={handleCardLike}>
              </Main>
              <Footer/>
            </div>
          </ProtectedRoute>
        }/>
      </Routes>
    </CurrentUserContext.Provider>
  );
}

export default App;
