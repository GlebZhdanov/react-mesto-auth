import React, {useEffect} from 'react';
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

function App() {
  const[isEditProfilePopupOpen, switchIsEditProfilePopupOpen] = React.useState(false);
  const[isAddPlacePopupOpen, switchIsAddPlacePopupOpen] = React.useState(false);
  const[isEditAvatarPopupOpen, switchIsEditAvatarPopupOpen] = React.useState(false);
  const[isPopupWithSubmit, switchIsPopupWithSubmit] = React.useState(false);
  const[selectedCard, switchSelectCard] = React.useState({open: false, dataCard: {}});
  const[currentUser, setCurrentUser] = React.useState({});
  const[cards, setCards] = React.useState([]);
  const[dataCardDelete, setDataCardDelete] = React.useState('');

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

  function switchProfilePopup (e) {
    switchIsEditProfilePopupOpen(true);
  }

  function switchPlacePopup (e) {
    switchIsAddPlacePopupOpen(true);
  }

  function switchAvatarPopup (e) {
    switchIsEditAvatarPopupOpen(true);
  }

  function switchPopupWithSubmit (data) {
    switchIsPopupWithSubmit(true);
    setDataCardDelete(data)
  }

  function switchImagePopup(data){
    switchSelectCard({open: true, dataCard: data});
  }

  const closePopup = () => {
    switchIsEditProfilePopupOpen(false)
    switchIsAddPlacePopupOpen(false)
    switchIsEditAvatarPopupOpen(false)
    switchIsPopupWithSubmit(false)
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <>
        <div className="page">
          <Header />
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
          <Footer />
        </div>
      </>
    </CurrentUserContext.Provider>
  );
}

export default App;
