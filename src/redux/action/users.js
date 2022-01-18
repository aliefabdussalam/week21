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
        axios.post(`http://localhost:8800/login`, user)
        .then((response) => { 
            const token = response.data.message
            localStorage.setItem("user", JSON.stringify(response.data.data))
            localStorage.setItem("token", token)
            
            console.log(response)
            resolve(response)
        }).catch((err) => {
            reject(err)
            console.log(err)
        })
    })
}

export const UPDATE_USER = (form) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const idUser = user[0].id;
    return new Promise((resolve, reject) => {
      const headers = {
        "Content-Type": "multipart/form-data",
        
      };
      axios
        .put(`http://localhost:8800/user/${idUser}`, form, { headers })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

export const ACTION_GET_ALL_user = () => {
    return (dispatch) => {
        dispatch(alluserPending())
        axios.get('http://localhost:8800/user').then((response) => {
            
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
export const ACTION_GET_DETAILS_USER = (id) => {
    return (dispatch) => {
      dispatch(userDetailsPending());
      axios
        .get(`http://localhost:8800/user/${id}`)
        .then((result) => {
          dispatch(userDetailsFullFilled(result.data.data));
        })
        .catch((err) => {
          dispatch(userDetailsRejected(err));
        });
    };
  };
  const userDetailsPending = () => {
    return {
      type: "GET_USER_DETAILS_PENDING",
    };
  };
  
  const userDetailsFullFilled = (payload) => {
    return {
      type: "GET_USER_DETAILS_FULLFILLED",
      payload,
    };
  };
  
  const userDetailsRejected = (payload) => {
    return {
      type: "GET_USER_DETAILS_REJECTED",
      payload: "An error occurred!",
    };
  };
  