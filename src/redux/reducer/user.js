const initialState = {
    all: [],
    loadAll: false,
    errorAll: false,
    errorAllMessage: "err",
    details:[],
    loadDetails: false,
    errorDetails: false,
    errorDetailsMessage: "Data Not Found"
}

const userReducer = (state=initialState, action) => {
    switch (action.type) {
        case "GET_ALL_user_PENDING":
            return { ...state, loadAll: true}
        case "GET_ALL_user_FULFILLED":
            return { ...state, loadAll: false, all: action.payload }
        case "GET_ALL_user_REJECTED":
            return { ...state, loadAll: false, errorAll: true, errorAllMessage: action.payload }
            case "GET_USER_DETAILS_PENDING":
            return {
                ...state,
                loadDetails: true
            }

        case "GET_USER_DETAILS_FULLFILLED":
            return {
                ...state,
                loadDetails: false,
                details: action.payload,
                errorDetailsMessage: "Get Users Success"
            }

        case "GET_USER_DETAILS_REJECTED": {
            return {
                ...state,
                loadDetails: false,
                errorDetailsMessage: action.payload
            }
        }
        default:
            return state;
    }
}

export default userReducer