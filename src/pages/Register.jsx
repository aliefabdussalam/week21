import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { INSERT } from "../redux/action/users";
import { Link } from "react-router-dom";
import "./css/login.css"

const Register = () =>{
    const [user, setUser] = useState({
        username:"",
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
    const [errMsg, setErr] = useState()
    const handleSubmit = (e) => {
        e.preventDefault() 
        if(user.numberPhone==="" || user.password === ""){
            setErr("nomor telepon atau password tidak boleh kosong")
          } else if (user.username==="") {
            setErr("username tidak boleh kosong")
          }  else {
            INSERT(user).then(() =>{
              history.push(`/`);
            }).catch((err) =>{
              setErr(err.response.data.error)
            })
          }
    }
    return(
        <div class="container-fluid col-12 body">
        <div class="row justify-content-center bg-light background">
            <div class="col-md-6 col-lg-5 bg-white mt-5 mb-5 card">
                <div class="Register-wrap p-4 p-md-5">
                    <div class="headersignup">
                        <p class="formtext"><Link to="/">Back</Link></p>
                        <h5 class="text-center mb-4 head">Register</h5>
                    </div>
              
              <h5 class="text-left mb-4">Let's create your account</h5>
                    <form onSubmit={handleSubmit} class="Register-form">
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
                  <p class="formtext">Username :</p>
                      <input 
                      type="text" 
                      class="form-control border-0 border-bottom rounded-left"
                      name="username" 
                      placeholder="username" 
                      value={user.username}
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
            <p style={{color:'red'}}>{errMsg}</p> 
    
            <div class="d-grid gap-2 mt-3">
                <button class="btnl " type="button" onClick={handleSubmit}>Register</button>
            </div>
            <div class="text-center mt-2">Register with</div>
            <div class="d-grid gap-2 mt-3">
                <button class="btnl btnlgoogle " type="button" onClick={handleSubmit}>Google</button>
            </div>
           
          </form>
        </div>
            </div>
        </div>
    </div>
    )

}

export default Register