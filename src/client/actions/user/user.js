import 'whatwg-fetch'
import { routerActions } from 'react-router-redux'
import cookie from 'react-cookie'

import { LOGIN_SUCCESS } from '../../constants/ActionTypes'
import { COOKIE_USER, COOKIE_DOMAIN, COOKIE_TENANT } from '../../constants/GeneralTypes'


export function handleLoginForm(username, password, domain, client, secret, callback) {
  const url = `/auth`
  const formData = {username, password, domain, client, secret}

  return (dispatch) => {
    fetch(url, {
      method: 'post',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(res => {
      return res.json()
    }).then(payload => {
      if(payload.username && payload.domain && payload.token) {
        cookie.save('timeliToken', payload.token)
        cookie.save('domain', payload.domain)
        dispatch({
            type: LOGIN_SUCCESS,
            user: payload.username
          })
      } else {
        return Promise.reject(payload)
      }
    }).then(() => {
      dispatch(routerActions.push('/dashboard'))
    }).catch(e => {
      console.error(`${e.error}`)
      dispatch(routerActions.push('/login?message='+encodeURI(`${e.error}`)))
      callback()
    })
  }
}

export function checkUser() {
   return (dispatch) => {
     if (!cookie.load(COOKIE_USER)) {
       dispatch(routerActions.push('/login'))
     }
   }
}

export function initUser(user, password) {
  return (dispatch) => {
    //first login this user (where is the tenant?)
    //then set the cookie
    cookie.save(COOKIE_USER, user)
    dispatch(routerActions.push('/home'))
  }
}
