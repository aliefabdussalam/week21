import {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {  LOGIN } from "../redux/action/users";
import { useDispatch } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css'
import "./css/login.css"
const Login = () =>{
    const dispatch = useDispatch
    const [user, setUser] = useState({
        numberPhone: "",
        password: "",
    })
    const setData=(event)=>{
        setUser({
            ...user,
            [event.target.name]: event.target.value
        })
    }
    const history = useHistory()
    const handleSignIn = (e) => {
        e.preventDefault()
        LOGIN(user)
        .then((response) => {
            console.log(response)
            
            history.push('/chat')
        }).catch((err) => {
            alert("password / nomor telepon salah")
            console.log(err)
        })
    }
    return(
        <div class="container-fluid col-12 body">
        <div class="row justify-content-center bg-light background">
            <div class="col-md-6 col-lg-5 bg-white mt-5 mb-5 card">
                <div class="login-wrap p-4 p-md-5">
              <h5 class="text-center mb-4 head">Login</h5>
              <h5 class="text-left mb-4">HI Welcome Back</h5>
                    <form onSubmit={handleSignIn} class="login-form">
                        <p class="formtext">Nomor Telepon :</p>
                  <div class="form-group">
                      <input 
                      type="text" 
                      class="form-control border-0 border-bottom rounded-left"
                      name="numberPhone" 
                      placeholder="nomor telepon" 
                      value={user.numberPhone}
                      onChange={setData}
                      required />
                  </div>
            <div class="form-group mt-3">
                <p class="formtext">Password :</p>
              <input 
              type="password" 
              name="password"
              value={user.password}
              onChange={setData} 
              class="form-control border-0 border-bottom col-10 mx-auto" 
              placeholder="Password" 
              required />
            </div>
                <p class="forgot">Forgot Password?</p>
    
            <div class="d-grid gap-2 mt-3">
                <button class="btnl " type="button" onClick={handleSignIn}>Login</button>
            </div>
            <div class="text-center mt-2">Login with</div>
            <div class="d-grid gap-2 mt-3">
                <button class="btnl btnlgoogle " type="button" onClick={handleSignIn}>Google</button>
            </div>
            <p class="dont text-center mt-4">Dont have an account?<Link to="/register">Sign up</Link></p>
          </form>
        </div>
            </div>
        </div>
    </div>
    )
}
export default Login