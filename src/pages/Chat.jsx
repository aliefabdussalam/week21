import axios from "axios";
import React, { useEffect, useState } from "react";
import socket from '../config/socket'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ACTION_GET_ALL_user } from "../redux/action/users";
import {Link, useHistory} from "react-router-dom";
import "./css/chat.css"

const Chat = () =>{
    const user = JSON.parse(localStorage.getItem("user"))
    socket.emit('login',user[0].username)

    const dispatch = useDispatch()
    const userall = useSelector((state) => state.user)
    const listUser = userall.all
    const [listmsg, setlistmsg] = useState([])
    const [listmsghistory, setlistmsghistory] = useState([])
    useEffect(()=>{
        dispatch(ACTION_GET_ALL_user(userall))
       }, [])
    const [receiver, setReceiver] = useState('')
    const [msg, setmessage] = useState('')
    const changeReceiver = (username) =>{
        setReceiver(username)
        socket.emit("get-message", {receiver:username, sender:user[0].username})
        setlistmsg([])
        socket.on("history-message", (payload) => {
            setlistmsghistory(payload)
            console.log(listmsghistory)
        })
    }
    const handlesendmsg = (e) =>{
        e.preventDefault()
        socket.emit("send-message",{
            sender: user[0].username,
            receiver,
            msg
        })
        setlistmsg([...listmsg, {
            sender: user[0].username,
            receiver,
            msg
        }])
        setmessage('')
    }
    const history = useHistory()
    const logout = (e) =>{
        e.preventDefault()
        localStorage.clear()
        history.push('/')
    }
    useEffect(()=>{
        socket.on("list-message", (payload) => {
            setlistmsg([...listmsg,payload])
            setReceiver(payload.sender)
        })
        socket.on("history-message",(payload) =>{
            setlistmsghistory([payload])
        })
    })
   
    return(
        <div class="container-fluid home">
            <div class="d-flex navbarchat">
            <h3 class="telegram m-1"> Telegram </h3><button class="btn" onClick={logout}>log out</button><strong class="align-items-center mt-2 receiver">{receiver}</strong>
            </div>
            
            <table >
                <tr>
                    <td style={{width: "20%"}} class="list">
                       <input
                       placeholder="Type your message"
                       class="form-control"
                        />
                       {listUser.length <= 0 ? (
                           <div>
                               user not found
                           </div>
                       ) : (
                           listUser.map((e, i) =>{ 
                               if(e.username !== user[0].username){
                                   return(
                                    <div key={i}>
                                        {/* <button class="btn btn-link btnuser" onClick={() => changeReceiver(e.username)}><img src={e.image} alt=""/>{e.username}</button> */}
                                        <p onClick={() => changeReceiver(e.username)} style={{cursor:'pointer'}} >{e.username}</p>
                                    </div>
                                   )
                               }
                           })
                       )}
                    </td>
                    <td style={{width: "80%"}} class="bg-light"> 
                        <div style={{height: "85vh", }}>
                            {
                                listmsghistory.map((e, i) => {
                                    if(e.receiver === receiver || e.sender === receiver) {
                                        return (
                                            <div key={i}>
                                                {e.sender} : {e.message}
                                            </div>
                                        );         
                                    }    
                                        
                                })
                       }
                        {
                                listmsg.map((e, i) => {
                                    if(e.receiver === receiver || e.sender === receiver) {
                                        return (
                                            <div key={i}>
                                                {e.sender} : {e.msg}
                                            </div>
                                        );     
                                    }    
                                           
                                })
                       }
                        </div>
                        <div>
                            <form onSubmit={handlesendmsg}>
                                <input 
                                placeholder="Type your message here..."
                                class="form-control"
                                value={msg}
                                onChange={(e) => setmessage(e.target.value)}
                                type="text" />
                                
                            </form>
                        </div>
                    </td>
                </tr>
            </table>
            <div></div>
        </div>
    )

}

export default Chat