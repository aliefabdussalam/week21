import { createStore, combineReducers, applyMiddleware} from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import userReducer from './reducer/user'



const reducers = combineReducers({
    user: userReducer,
    
})
const middleware = applyMiddleware(thunk, logger)

const store = createStore(reducers, middleware)

export default store 