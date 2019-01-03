const INITIAL_STATE ={
    user: '',
    image: '',
    email: '',
    auth0_id: '',
    credit: 0
}
const SET_USER = "SET_USER";
const LOGOUT_USER = "LOGOUT_USER";
const USER_NAME = "USER_NAME";
const CHANGE_EMAIL = "CHANGE_EMAIL";
const CHANGE_IMAGE = "CHANGE_IMAGE";

export default function reducer (state = INITIAL_STATE, action) {

    switch (action.type){
        case SET_USER:
        return Object.assign({},state,{user: action.payload[0], 
            image: action.payload[1],
            email: action.payload[2],
            auth0_id: action.payload[3]})
        case USER_NAME:
        return Object.assign({},state,{user: action.payload})
        case CHANGE_EMAIL:
        return Object.assign({},state,{email: action.payload})
        case CHANGE_IMAGE:
        return Object.assign({},state,{image: action.payload})
        case LOGOUT_USER:
        return Object.assign({    
            user: '',
            image: '',
            email: '',
            auth0_id: '',
            credit: 0})
        default: return state;
    }
}

export function setUser(user){
    return {
        type: SET_USER,
        payload: user
    }
}

export function logOutUser(user){
    return {
        type: LOGOUT_USER,
        payload: user
    }
}

export function userName(user){
    return {
        type:USER_NAME,
        payload: user
    }
}

export function changeEmail(email){
    return {
        type: CHANGE_EMAIL,
        payload: email
    }
}

export function changeImage(image){
    return {
        type: CHANGE_IMAGE,
        payload: image
    }
}
