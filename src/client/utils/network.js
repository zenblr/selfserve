import { push } from 'react-router-redux'
import cookie from 'react-cookie'
import 'whatwg-fetch'

/**
 * Utility function to make an http call with the JSON timeli headers,
 * expecting and processing a JSON payload.
 *
 * @param url
 * @param dispatch
 * @returns {*|Promise.<T>}
 */
export function httpCall(url, dispatch) {
  const token = cookie.load('timeliToken')
  let headers = {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token,
      'X-Timeli-Version': '3'
  }
  if (getDomain()) {
    return fetch(url, {
      headers: headers
    }).then(res => {
      if (res === {} || res.status === 204) {
        return {}
      } else if (res.status === 401) {
        dispatch(push('/login'))
        throw new Error(`Authentication rejected.`)
      }
      return res.json()
    })
  } else {
    dispatch(push('/login'))
    return Promise.reject('Authentication failed: Domain not set.')
  }
}

export function httpSend(url, method, data, dispatch) {
  const token = cookie.load('timeliToken')

  let body = [];
  Object.keys(data).map((key,i) => {
    body.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
  })
  body = body.join('&')

  let headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + token,
    'X-Timeli-Version': '3',
    'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
  }
  if (getDomain()) {
    return fetch(url, {
      method:method,
      headers: headers,
      body:body
    }).then(res => {
      if (res === {} || res.status === 204) {
        return {}
      } else if (res.status === 401) {
        dispatch(push('/login'))
        throw new Error(`Authentication rejected.`)
      }
      return res.json()
    })
  } else {
    dispatch(push('/login'))
    return Promise.reject('Authentication failed: Domain not set.')
  }
}

/**
 * Simple semantic shortcut to getting the domain from the cookie jar
 *
 * @returns {*}
 */
export function getDomain() {
  return cookie.load('domain')
}

/**
 * Helper method to clear out the user session.
 *
 * @param dispatch
 */
export function logoutCall(dispatch) {
  cookie.remove('timeliToken')
  dispatch(push('/login'))
}

