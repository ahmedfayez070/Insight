const initState = {
  nurseryId : 0,
  courseId: 0,
  courseName: ''
}

const loginState = {
  token: '',
  type: ''
}

const info = {
  governorates: []
}

const phoneNumber = {
  OTP: ''
}

const provider = {
  nurseryId: '',
  nurseryName: ''
}

const child = {
  childId: '',
  childName: ''
}

const reservationReq = {
  reservationId: ''
}

export const reservationReqReducer = (state = reservationReq, action) => {
  if (action.type == 'CHANGE_RESERVATION_ID') {
    return { reservationId: action.data }
  }
  return state
}

export const childReducer = (state = child, action) => {
  if (action.type == 'CHANGE_CHILD_ID_NAME') {
    return {
      childId: action.data[0],
      childName: action.data[1]
    }
  }
  return state
}

export const providerReducer = (state = provider, action) => {
  if (action.type == 'CHANGE_PROVIDER_NURSERY_ID') {
    return {
      nurseryId: action.data[0],
      nurseryName: action.data[1]
    }
  }
  return state
}

export const reducer = (state = initState, action) => {
  if (action.type == 'CHANGE_NURSERY_ID') {
    return {nurseryId : action.data}
  } else if (action.type == 'CHANGE_COURSE_ID') {
    return {
      courseId: action.data[0],
      courseName: action.data[1]
    }
  } else if (action.type == 'CHANGE_NURSERY_COURSE_ID') {
    return {
      nurseryId: action.data[0],
      courseId: action.data[1]
    }
  }
  return state
}

export const loginReducer = (state = loginState, action) => {
  if (action.type === 'CHANGE_LOGIN_TOKEN'){
    return {token: action.data[0], type: action.data[1]}
  }else if (action.type === 'LOG_OUT') {
    return {token: action.data, type: action.data}
  }
  return state
}

export const infoReducer = (state = info, action) => {
  if (action.type === 'CHANGE_INFO') {
    return {
      governorates: action.data.governorates
    }
  }
  return state
}

export const phoneNumberReducer = (state = phoneNumber, action) => {
  if (action.type === 'CHANGE_PHONE_NUMBER') {
    return {
      phoneNumber: action.data
    }
  }
  return state
}