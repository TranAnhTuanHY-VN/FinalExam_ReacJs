import Api from './Api';

const url = "/users";
//Login
const existsByEmail = (email) => {
    return Api.get(`${url}/email/${email}`);
};

const existsByUsername = (username) => {
    return Api.get(`${url}/userName/${username}`);
};

const create = (firstname,lastname,username,email,password) => {
    const body = {
        firstName: firstname,
        lastName: lastname,
        userName: username,
        email: email,
        password: password
    }
    return Api.post(url,body);
}

const resendEmailToActiveAccount = (email)=>{
    
    const param = {
        email: email
    }

    return Api.get(`${url}/userRegistrationConfirmRequest`,{params:param});
};


//ResetPassword
const requestResetPassword = (email)=>{
    
    const param = {
        email: email
    }

    return Api.get(`${url}/resetPasswordRequest`,{params:param});
};

const resendEmailToResetPassword = (email)=>{
    
    const param = {
        email: email
    }

    return Api.get(`${url}/resendResetPassword`,{params:param});
};

const resetPassword = (token,newPassword)=>{
    
    const param = {
        token: token,
        newPassword: newPassword
    }

    return Api.get(`${url}/resetPassword`,{params:param});
};

const getProfile = ()=>{
    return Api.get(`${url}/profile`);
};

const updateProfile = (avatarUrl)=>{
    const body = {
        avatarUrl: avatarUrl
    }
    return Api.put(`${url}/profile`,body);
};

// export
const api = {existsByEmail,existsByUsername,create, resendEmailToActiveAccount, requestResetPassword,resendEmailToResetPassword,resetPassword,getProfile,updateProfile}
export default api;

