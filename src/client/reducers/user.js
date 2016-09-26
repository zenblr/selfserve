import Immutable from 'immutable';
import {LOGIN_SUCCESS} from '../constants/ActionTypes'


const initialState = {
  user: null
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}