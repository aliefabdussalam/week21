import { Route, Switch } from "react-router-dom"


import Login from "../pages/Login"
import Chat from "../pages/Chat"
import Register from "../pages/Register"
import Guard from "./Guard"

const Router = () => {
    return (
        <Switch>
            <Route path='/' exact>
                <Login />
            </Route>
            <Route path='/register'>
                <Register />
            </Route>
            <Guard path="/chat" component={Chat} />
        </Switch>
    )
}

export default Router