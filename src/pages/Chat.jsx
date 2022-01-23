import React, { useEffect, useState } from "react";
import Loading from "../component/Loading";
import socket from '../config/socket'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ACTION_GET_ALL_user, UPDATE_USER,ACTION_GET_DETAILS_USER } from "../redux/action/users";
import { useHistory} from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input} from 'reactstrap';
import { HiMenuAlt1 } from "react-icons/hi"
import { BiSearch } from "@react-icons/all-files/bi/BiSearch";
import { RiSendPlaneFill } from 'react-icons/ri'
import { FaAngleLeft } from "react-icons/fa";
import { AiOutlinePlus } from "@react-icons/all-files/ai/AiOutlinePlus";

import "./css/chat.css"

const Chat = () =>{
    const user = JSON.parse(localStorage.getItem("user"))   
    const idUser = user[0].id;
    socket.emit('login',user[0].username)
    const dispatch = useDispatch()
    const userall = useSelector((state) => state.user)
    const listUser = userall.all
    const [SidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prevState) => !prevState);
    const closeSidebar = () => setSidebarOpen(false)
    const [listmsg, setlistmsg] = useState([])
    const [listmsghistory, setlistmsghistory] = useState([])
    const [notif, setNotif]= useState({})
    const userlogin = useSelector((state) => state.user.details[0]);
    const [receiver, setReceiver] = useState('')
    const [msg, setmessage] = useState('') 
    const [search, setSearch] = useState();
    const [chatOpen, setChatOpen] = useState(false);
   
    const toggleChat = () => setChatOpen((prevState) => !prevState);
    const closeChat = () => setChatOpen(false)
       
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDrop = () => setDropdownOpen(prevState => !prevState);
    const [form, setForm] = useState({
      username: "",
      image: "", 
      number_phone: "",
      displayName:"",
      bio:"",
      imgPreview:""
  })
  const getUser = ()=>{
    dispatch(ACTION_GET_ALL_user(userall))
  }
    console.log(form)
    useEffect(()=>{
        getUser()
        dispatch(ACTION_GET_DETAILS_USER(idUser))
       },[])
       
       useEffect(()=>{
      
        setForm({
            username: user[0].username,            
            image: user[0].image,
            number_phone: user[0].number_phone,
            displayName:user[0].displayName,
            bio:user[0].user,
        });
    },[])
  const setFile = (event)=>{
    let fileName = document.getElementById("image").value;
    const idxDot = fileName.lastIndexOf(".") + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if(extFile=="jpg" || extFile=="jpeg" || extFile=="png"){
      setForm({
        ...form,
        image: event.target.files[0],
        imgPreview: URL.createObjectURL(event.target.files[0])
      })
    }else{
      alert("Only jpg/jpeg and png files are allowed!")
      setForm({
        ...form,
        image: "",
      })
    }
   
  }
  
    const changeReceiver = (username) =>{
        setReceiver(username)
        socket.emit("get-message", {receiver:username, sender:user[0].username})
        setlistmsg([])
        socket.on("history-message", (payload) => {
            setlistmsghistory(payload)
        })
        toggleChat()
       
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
        
        console.log(listmsg)
        setmessage('')
    }
   
    const handleSubmit = (e) =>{
      e.preventDefault();
      const formData = new FormData();
      formData.append("username", form.username);    
      formData.append("image", form.image);      
      formData.append("numberPhone", form.number_phone);
      formData.append("displayName", form.displayName);
      formData.append("bio", form.bio)
      UPDATE_USER(formData)
      .then((res)=>{
          alert("Update User Success");
          dispatch(ACTION_GET_ALL_user(userall))
      }).catch((err)=>{
          alert("Cannot Update Data");
      })
  }
  const changeText = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
    });
}; 
    const handleSearch = (e) => {
      e.preventDefault();
      dispatch(ACTION_GET_ALL_user(search))
    };
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
    })
   
    return(
      <div>
      {userall.loadAll === true || userall.errorAll === true  ? (
        <Loading />
    ):(
        <div class="container-fluid home">
            <div class="d-flex navbarchat col-12 ">
                <div><p class="telegram col-4 mt-2 me-5 "> Telegram </p></div>
                <Dropdown isOpen={dropdownOpen} toggle={toggleDrop} className="ms-lg-5">
                <DropdownToggle style={{backgroundColor:'transparent', padding:'0', border:'none'}}>
                  <HiMenuAlt1 style={{width:'30px', height:'40px', color:'#7E98DF'}}/>
                </DropdownToggle>
                <DropdownMenu className='dropmenu' right>
                  <DropdownItem onClick={toggleSidebar}className='dropitem'>
                    <div className='imgbox'>
                    </div>
                    <p>Settings</p>
                  </DropdownItem>
                  <DropdownItem className='dropitem'>
                    <div className='imgbox'>
                      </div>
                    <p>Contacts</p>
                  </DropdownItem>
                  <DropdownItem className='dropitem'>
                    <div className='imgbox'>
                      </div>
                    <p>Invite Friends</p>
                  </DropdownItem>
                  <DropdownItem className='dropitem' onClick={logout}>
                    <div className='imgbox'>
                      </div>
                    <p>Log out</p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <div>
                                        {SidebarOpen === true ? (
                                            <form className="sideBarProfile vh-100 bg-white w-lg-25 w-sm-100" onSubmit={handleSubmit}>
                                                <div className="d-flex mt-4 mb-4 w-100 align-items-center">
                                                    <div className="iconLeft d-flex justify-content-center center fs20 ">
                                                        <FaAngleLeft clasName="text-danger" onClick={closeSidebar} />
                                                    </div>
                                                    <h1 className="text-capitalize profileUpdate text-center textLightBlue fw-bold w-100 fs20 d-flex justify-content-center">{userlogin.username}</h1>
                                                </div>
                                                <div className="d-flex align-items-center flex-column">
                                                
                                                <div className="profilePictureUpdate">
                                                    <img src={form.imgPreview ? form.imgPreview :"http://localhost:8800/"+user[0].image} alt="" />
                                                    
                                                    </div>
                                                    <Input
                                                    type="file"
                                                    name="image"
                                                    id="image"
                                                    onChange={setFile}
                                                    accept="image/*"
                                                  />
                                                   
                                                    <h1 className="fs20 m-0 mt-2 fw-bold text-dark text-capitalize">{userlogin.username}</h1>
                                                    
                                                </div>
                                                <div className="p-2 mt-2 rubik">
                                                    <h1 className="fs16 fw-bold">Account</h1>
                                                    <label for="" className="textGray fs14 mt-2 mb-2">Number Phone</label><br />
                                                    <input type="text" className="inputBoxUpdate" name="number_phone" value={form.number_phone} onChange={changeText}  /><br />
                                                    <hr />
                                                    <label for="" className="fs14 fw-bold mb-2">Username</label><br />
                                                    <input type="text" name="username" className="fs14 textGray inputBoxUpdate" value={form.username} onChange={changeText} />
                                                    <hr />
                                                    <label for="" className="fs14 fw-bold mb-2">Display Name</label><br />
                                                    <input type="text" name="displayName" className="fs14 textGray inputBoxUpdate" value={form.displayName} onChange={changeText} />
                                                    <hr />
                                                    <label for="" className="fs14 fw-bold mb-2">Bio</label><br />
                                                    <input type="text" name="bio" className="fs14 textGray inputBoxUpdate" value={form.bio} onChange={changeText} />
                                                    
                                                </div>
                                                <div className="ps-2">
                                                    <hr />
                                                </div>
                                                <div className="ps-2">
                                                    <button type="submit" className="btn  btnSave w-100 text-white fw-bold">Save</button>
                                                </div>
                                            </form>
                                        ): null}
                                    </div>
                                    
                <div>
                    {(
                           listUser.map((e, i) =>{ 
                               if(e.username === receiver){
                                   return(
                                       <div className="listuser ms-5 mt-1 d-none d-lg-block">
                                    <img src={"http://localhost:8800/"+e.image} alt="" srcset="" />
                                    <div className="d-flex flex-column">
                                      <p style={{marginBottom:'0px'}} className="usernow">{e.username}</p>
                                    </div>
                                  </div>
                                     
                                   )
                               }
                           })
                       )}
                </div>
             
            </div>
            
            <table >
                <tr className="d-none d-sm-block">
                    <td style={{width: '25%'}} className="list">
                    <div className="searchbox" style={{display:'flex', width:'100%'}}>
                        <div className="box" style={{display:'flex', width:'80%'}}>
                            <BiSearch className="src"/>
                            <input type="text" placeholder="Type your search..." onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <AiOutlinePlus className="plus" onClick={handleSearch}/>
                    </div>
                    <div>
                       {listUser.length <= 0 ? (
                           <div>
                               user not found
                           </div>
                       ) : (
                           listUser.map((e, i) =>{ 
                               if(e.username !== user[0].username){
                                   return(
                                    <div onClick={() => changeReceiver(e.username)} className="listuser" key={i} style={{cursor:'pointer',display:'flex'}}>
                                    <img src={"http://localhost:8800/"+e.image} alt="" srcset="" />
                                    <div className="d-flex flex-column">
                                    <p style={{marginBottom:'5px'}} >{e.username}
                                    {/* {userOn.includes(`${e.id}`)?<FaCircle style={{color:'lightgreen', fontSize:'10px', marginLeft:'10px'}}/>:null} */}
                                    </p>
                                    {notif.sender === e.id?<p style={{overflow:'hidden', textOverflow:'ellipsis', width:'70px', height:'30px', margin:'0'}}>{notif.msg}</p>:null}
                                    </div>
                                  </div>
                                   )
                               }
                           })
                       )}
                    </div>
                    </td>
                   
                    <td style={{width: "75%", backgroundColor:" #f0efef"}}> 
                        <div style={{height: "80vh", }}>
                        <div className="chatbox ">
                            {
                                listmsghistory.map((e, i) => {
                                    if(e.receiver === receiver || e.sender === receiver) {
                                        return (
                                            <div key={i}>
                                                {e.sender === receiver ?
                                                (
                                                  <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'flex-start'}}>
                                                    <div className="text" style={{ width:"auto", backgroundColor:'skyblue', borderRadius:"35px 10px 35px 35px", display:"flex", alignItems:"center", justifyContent:"flex-end"}} >
                                                      <p style={{margin:'0', cursor:'pointer'}}>{e.message}</p>
                                                       </div>     
                                                  </div>):
                                                (
                                                  <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-end'}}>
                                                    <div className="text" style={{ width:"auto", backgroundColor:'#7E98DF', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                                                      <p style={{margin:'0'}}>{e.message}</p>
                                                    </div>
                                                  </div>)}
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
                                                {e.sender === receiver ?
                                                (
                                                  <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'flex-start'}}>
                                                    <div className="text" style={{ width:"auto", backgroundColor:'skyblue', borderRadius:"35px 10px 35px 35px", display:"flex", alignItems:"center", justifyContent:"flex-end"}} >
                                                      <p style={{margin:'0'}}>{e.msg}</p>
                                                       </div>
                                                  </div>):
                                                (
                                                  <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-end'}}>
                                                    <div className="text" style={{ width:"auto", backgroundColor:'#7E98DF', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                                                      <p style={{margin:'0'}}>{e.msg}</p>
                                                    </div>
                                                  </div>)}
                                            </div>
                                        );     
                                    }    
                                           
                                })
                       }
                       </div>
                        </div>
                        <div>
                            <div className='sendbox'>
                                <div className="send">
                                  <form onSubmit={handlesendmsg}>
                                    <input type="text"
                                    value={msg}
                                    placeholder="Type your message..."
                                    onChange={(e) =>setmessage(e.target.value)}/>
                                  </form>
                                  <div className='rowbox'>
                                    <RiSendPlaneFill onClick={handlesendmsg} style={{color:'#7E98DF', fontSize:'40px', cursor:'pointer'}}/>
                                  </div>
                                </div>
                            </div>
                        </div>
                    
                    </td>
                </tr>
                <tr>
                <td style={{width: "75%", backgroundColor:" #f0efef"}} className={chatOpen === true ? "d-lg-none" : "d-none"}> 
                      <div style={{height: "60vh", }}>
                      <div>
                      {(
                           listUser.map((e, i) =>{ 
                               if(e.username === receiver){
                                   return(
                                <div className="listusermobile ps-2 mt-0 bg-white row">
                                 <div className="iconLeft mt-3 fs20 ">
                                    <FaAngleLeft clasName="text-danger me-5" onClick={closeChat} />
                                  </div>
                                    <img src={"http://localhost:8800/"+e.image} alt="" srcset=""/>
                                    <p className="usernowmobile">{e.username}</p>                                    
                                </div>
                                     
                                   )
                               }
                           })
                       )}
                      </div>
                      <div className="chatbox ">
                          {
                              listmsghistory.map((e, i) => {
                                  if(e.receiver === receiver || e.sender === receiver) {
                                      return (
                                          <div key={i}>
                                              {e.sender === receiver ?
                                              (
                                                <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'flex-start'}}>
                                                  <div className="text" style={{ width:"auto", backgroundColor:'skyblue', borderRadius:"35px 10px 35px 35px", display:"flex", alignItems:"center", justifyContent:"flex-end"}} >
                                                    <p style={{margin:'0', cursor:'pointer'}}>{e.message}</p>
                                                     </div>     
                                                </div>):
                                              (
                                                <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-end'}}>
                                                  <div className="text" style={{ width:"auto", backgroundColor:'#7E98DF', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                                                    <p style={{margin:'0'}}>{e.message}</p>
                                                  </div>
                                                </div>)}
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
                                              {e.sender === receiver ?
                                              (
                                                <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'flex-start'}}>
                                                  <div className="text" style={{ width:"auto", backgroundColor:'skyblue', borderRadius:"35px 10px 35px 35px", display:"flex", alignItems:"center", justifyContent:"flex-end"}} >
                                                    <p style={{margin:'0'}}>{e.msg}</p>
                                                     </div>
                                                </div>):
                                              (
                                                <div className="chatlist" style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-end'}}>
                                                  <div className="text" style={{ width:"auto", backgroundColor:'#7E98DF', borderRadius:"35px 35px 35px 10px", display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                                                    <p style={{margin:'0'}}>{e.msg}</p>
                                                  </div>
                                                </div>)}
                                          </div>
                                      );     
                                  }    
                                         
                              })
                     }
                     </div>
                      </div>
                      <div>
                          <div className='sendbox'>
                              <div className="send">
                                <form onSubmit={handlesendmsg}>
                                  <input type="text"
                                  value={msg}
                                  placeholder="Type your message..."
                                  onChange={(e) =>setmessage(e.target.value)}/>
                                </form>
                                <div className='rowbox'>
                                  <RiSendPlaneFill onClick={handlesendmsg} style={{color:'#7E98DF', fontSize:'40px', cursor:'pointer'}}/>
                                </div>
                              </div>
                          </div>
                      </div>
                  
                  </td>
                  <td style={{width: '25%'}} class="list" className={chatOpen === false ? "d-lg-none " : "d-none"}>
                    
                    <div>
                       {listUser.length <= 0 ? (
                           <div>
                               user not found
                           </div>
                       ) : (
                           listUser.map((e, i) =>{ 
                               if(e.username !== user[0].username){
                                   return(
                                    <div onClick={() => changeReceiver(e.username)} className="listuser" key={i} style={{cursor:'pointer',display:'flex'}}>
                                    <img src={"http://localhost:8800/"+e.image} alt="" srcset="" />
                                    <div className="d-flex flex-column">
                                    <p style={{marginBottom:'5px'}} >{e.username}
                                    {/* {userOn.includes(`${e.id}`)?<FaCircle style={{color:'lightgreen', fontSize:'10px', marginLeft:'10px'}}/>:null} */}
                                    </p>
                                    {notif.sender === e.id?<p style={{overflow:'hidden', textOverflow:'ellipsis', width:'70px', height:'30px', margin:'0'}}>{notif.msg}</p>:null}
                                    </div>
                                  </div>
                                   )
                               }
                           })
                       )}
                    </div>
                    </td>
                </tr>
            </table>
            <div></div>
        </div>
         )}
         </div>
    )
   
}

export default Chat