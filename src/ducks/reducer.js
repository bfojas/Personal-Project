const INITIAL_STATE ={
    user: '',
    image: '',
    email: '',
    auth0_id: '',
    bank: 0
}
const SET_USER = "SET_USER";
const LOGOUT_USER = "LOGOUT_USER";
const EDIT_USER = "EDIT_USER";
const UPDATE_BANK = "UPDATE_BANK";

export default function reducer (state = INITIAL_STATE, action) {

    switch (action.type){
        case SET_USER:
            return Object.assign({},state,{user: action.payload[0], 
            image: action.payload[1],
            email: action.payload[2],
            auth0_id: action.payload[3],
            bank: action.payload[4]})

        case EDIT_USER:
            return Object.assign({},state,{
            user: action.payload.name,
            image: action.payload.image,
            email: action.payload.email})

        case LOGOUT_USER:
            return Object.assign({    
                user: '',
                image: '',
                email: '',
                auth0_id: '',
                bank: 0})
        
        case UPDATE_BANK:
            return Object.assign({},state,{bank:action.payload})
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

export function editUser(user){
    return {
        type:EDIT_USER,
        payload: user
    }
}

export function updateBank(bank){
    return{
        type: UPDATE_BANK,
        payload: bank
    }
}