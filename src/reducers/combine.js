import { combineReducers } from 'redux'
import { reducer, loginReducer, infoReducer, phoneNumberReducer, providerReducer, reservationReqReducer, childReducer } from './reducer'

const rootReducer = combineReducers(
  { reducer, infoReducer, phoneNumberReducer, loginReducer, providerReducer, reservationReqReducer, childReducer }
)

export default rootReducer