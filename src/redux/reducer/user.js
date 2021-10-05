const initialState = {
    all: [],
    loadAll: false,
    errorAll: false,
    errorAllMessage: "err",
}

const userReducer = (state=initialState, action) => {
    switch (action.type) {
        case "GET_ALL_user_PENDING":
            return { ...state, loadAll: true}
        case "GET_ALL_user_FULFILLED":
            return { ...state, loadAll: false, all: action.payload }
        case "GET_ALL_user_REJECTED":
            return { ...state, loadAll: false, errorAll: true, errorAllMessage: action.payload }
        default:
            return state;
    }
}

export default userReducer