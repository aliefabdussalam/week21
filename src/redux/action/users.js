import axios from "axios";

export const INSERT = (formdata) => {
    console.log(formdata)
    return new Promise((resolve, reject) => {
        const {header} = {
            'Content-Type': 'application/json'
        }
        axios.post(`http://localhost:8800/register`, formdata, {header})
        .then((response) => {
            console.log(response.data)
            resolve(response.data)
        }).catch((err) => {
            reject(err)
        })
    })
}

export const LOGIN = (user) => {
    console.log(user)
    return new Promise((resolve, reject) => { 
        const {header} = {
            'Content-Type': 'application/json'
        }
        axios.post(`http://localhost:8800/login`, user, {header})
        .then((response) => { 
            const token = response.data.message
            localStorage.setItem("user", JSON.stringify(response.data.data))
            localStorage.setItem("token", token)
            resolve(response)
        }).catch((err) => {
            reject(err)
        })
    })
}

export const ACTION_GET_ALL_user = () => {
    return (dispatch) => {
        dispatch(alluserPending())
        axios.get('http://localhost:8800/user').then((response) => {
            console.log(response)
            dispatch(alluserFullfiled(response.data.data))
            
        }).catch((err) => {
            dispatch(alluserRejected())
        })
    }
}
const alluserPending = () => {
    return{
        type: "GET_ALL_user_PENDING"
    }
}

const alluserFullfiled = (payload) => {
    return{
        type: "GET_ALL_user_FULFILLED",
        payload
    }
}

const alluserRejected = () => {
    return{
        type: "GET_ALL_user_REJECTED",
        payload: "Terjadi kesalahan"
    }
}