import TYPE from "./Type";
import axios from "axios";
axios.defaults.withCredentials = true

export const closeAlert = () => dispatch => {
    dispatch({
        type: TYPE.CLOSE_ALERT
    })
}

export const login = ( email, password ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ email, password })
    try {
        const res = await axios.post("http://localhost:8000/api/auth/login/", body, config)
        dispatch ({
            type: TYPE.LOGIN_SUCCESS,
            payload: res.data
        })
    } catch (err) {
        dispatch ({
            type: TYPE.LOGIN_FAIL
        })
    }
}

export const verify = () => async dispatch => {
    if ( localStorage.getItem('access') ) {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const body = JSON.stringify({ "token": localStorage.getItem('access') });
        try {
            await axios.post("http://localhost:8000/api/auth/token/verify/", body, config);
            console.log("verified successfully");
            dispatch ({
                type: TYPE.VERIFY_SUCCESS
            });
        } catch (err) {
            dispatch ({
                type: TYPE.VERIFY_FAIL
            });
            await dispatch ( refresh() );
        }
    } else {
        dispatch ({
            type: TYPE.GUEST_VIEW
        });
    }
};
console.log('direct aaal')

export const getUser = () => async dispatch => {
    if ( localStorage.getItem('access') ) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ localStorage.getItem('access') }`
            }
        };
        try {
            const res = await axios.get("http://localhost:8000/api/auth/user", config);
            // console.log(res.data);
            dispatch ({
                type: TYPE.GET_USER_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch ({
                type: TYPE.GET_USER_FAIL
            });
        }
    } else {
        dispatch ({
            type: TYPE.GUEST_VIEW
        });
    }
}

export const refresh = () => async dispatch => {
    if ( localStorage.getItem('access') ) {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const res = await axios.post("http://localhost:8000/api/token/refresh/", config);
            console.log(res.data);
            dispatch ({
                type: TYPE.REFRESH_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            console.log(err);
            dispatch ({
                type: TYPE.REFRESH_FAIL
            })
        }
    } else {
        dispatch ({
            type: TYPE.GUEST_VIEW
        })
    }
}

export const changePassword = ( new_password1, new_password2, old_password ) => async dispatch => {
    await dispatch ( verify() );
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ localStorage.getItem('access') }`
        }
    };
    const body = JSON.stringify({ new_password1, new_password2, old_password });
    try {
        await axios.post("http://localhost:8000/api/auth/password/change/", body, config);
        dispatch ({
            type: TYPE.CHANGE_PASSWORD_SUCCESS
        });
    } catch (err) {
        dispatch ({
            type: TYPE.CHANGE_PASSWORD_FAIL
        });
    }
}

export const logout = () => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        await axios.post("http://localhost:8000/api/auth/logout/", config);
        dispatch ({
            type: TYPE.LOGOUT
        });
    } catch (err) {
        dispatch ({
            type: TYPE.LOGOUT
        });
    }
}

export const signup = ( email, first_name, last_name, password1, password2 ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ email, first_name, last_name, password1, password2 });
    console.log("data is sending");
    try {
        await axios.post("http://localhost:8000/api/auth/registration/", body, config);
        console.log("data is sent");
        dispatch ({
            type: TYPE.SIGNUP_SUCCESS
        });
        
    } catch (err) {
        dispatch ({
            type: TYPE.SIGNUP_FAIL
        });
    };
};

export const emailVerification = ( key ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ key });
    try {
        await axios.post("http://localhost:8000/api/auth/registration/verify-email/", body, config);
        dispatch ({
            type: TYPE.ACTIVATE_ACCTOUNT_SUCCESS
        });
    } catch (err) {
        dispatch ({
            type: TYPE.ACTIVATE_ACCTOUNT_FAIL
        });
    };
};

export const resetPassword = ( email ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ email });
    try {
        await axios.post("http://localhost:8000/api/auth/password-reset/", body, config);
        dispatch ({
            type: TYPE.RESET_SUCCESS
        });
    } catch (err) {
        dispatch ({
            type: TYPE.RESET_FAIL
        });
    };
};

export const resetPasswordConfirm = ( uid, token, new_password1, new_password2 ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ uid, token, new_password1, new_password2 });
    try {
        await axios.post("http://localhost:8000/dj-rest-auth/password/reset/confirm/", body, config);
        dispatch ({
            type: TYPE.SET_SUCCESS
        });
    } catch (err) {
        dispatch ({
            type: TYPE.SET_FAIL
        });
    };
};

export const googleLogin = ( code ) => async dispatch => {
    if ( !localStorage.getItem('access') ) {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        console.log("Before stringify=",code)    
        const body = JSON.stringify({ code })
        console.log("this is body for /google req=",body);
        try {
            const res = await axios.post("http://localhost:8000/api/auth/google/", body, config)
            console.log("key s response from google=",res.data);
            dispatch ({
                type: TYPE.LOGIN_SUCCESS,
                payload: res.data
            })
        } catch (err) {
            console.log(err);
            dispatch ({
                type: TYPE.LOGIN_FAIL
            })
        }
    } else {
        dispatch( verify() );
        dispatch( getUser() );
    }
}
