import Api from './Api';

const login = (username,password) =>{
    
    const param = {
        username: username,
        password:password
    }

    return Api.get(`/login`,{params:param});
};

// export
const api = { login}
export default api;

