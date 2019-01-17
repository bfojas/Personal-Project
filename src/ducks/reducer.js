const INITIAL_STATE ={
    user: '',
    image: '',
    email: '',
    auth0_id: '',
    bank: 0,
    wins:0,
    games:0,
    color: 'green'
}
const SET_USER = "SET_USER";
const LOGOUT_USER = "LOGOUT_USER";
const EDIT_USER = "EDIT_USER";
const UPDATE_STATS = "UPDATE_STATS";
const UPDATE_COLOR = "UPDATE_COLOR";

export default function reducer (state = INITIAL_STATE, action) {

    switch (action.type){
        case SET_USER:
            return Object.assign({},state,{user: action.payload[0], 
            image: action.payload[1],
            email: action.payload[2],
            auth0_id: action.payload[3],
            bank: action.payload[4],
            wins: action.payload[5],
            games: action.payload[6],
            color: action.payload[7]})

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
                bank: 0,
                wins: 0,
                games: 0,
                color: 'green'})
        
        case UPDATE_STATS:
            return Object.assign({},state,
                {bank:action.payload.credit,
                wins: action.payload.wins,
                games: action.payload.games})

        case UPDATE_COLOR:
                    console.log('hit')
                    return Object.assign({},state,{color: action.payload})
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

export function updateStats(stats){
    return{
        type: UPDATE_STATS,
        payload: stats
    }
}

export function updateColor(color){
    return {
        type: UPDATE_COLOR,
        payload: color
    }
}
