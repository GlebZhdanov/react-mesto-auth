export class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  changeLikeCardStatus(id, isLiked) {
    if(isLiked === true) {
      return fetch(`${this._url}/cards/likes/${id}`, {
        method: 'PUT',
        headers: this._headers,
      })
        .then((res) => {
          return this._chekRes(res)
        });
    } else {
      return fetch(`${this._url}/cards/likes/${id}`, {
        method: 'DELETE',
        headers: this._headers,
      })
        .then((res) => {
          return this._chekRes(res)
        });
    }
  }

  _chekRes(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(console.log(`Ошибка: ${res.status}`))
  }

  getAllCards() {
    return fetch(`${this._url}/cards`, {
      method: "GET",
      headers: this._headers
    })
    .then(res => {
      return this._chekRes(res)
    })
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: this._headers
    })
      .then((res) => {
        return this._chekRes(res)
      })
  }

  patchUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then((res) => {
        return this._chekRes(res)
      })
  }

  uploadAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then((res) => {
        return this._chekRes(res)
      })
  }

  postNewCard(data) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data)
    })
      .then((res) => {
        return this._chekRes(res)
      })
  }

  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then((res) => {
        return this._chekRes(res)
      })
  }
  }

  const api = new Api({
    url: 'https://mesto.nomoreparties.co/v1/cohort-30',
    headers: {
      authorization: 'b725fbaf-4205-4fab-8325-c71ecb1c6595',
      'Content-Type' : 'application/json'
    }
  })

  export {api}
