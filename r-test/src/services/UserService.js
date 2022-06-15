import axios from "axios";

const USERS_REST_API_URL = 'http://localhost:8083/api/users';

class UserService {
    getUsers() {
        return axios.get(USERS_REST_API_URL);
    }
    createUser(user){
        return axios.post(USERS_REST_API_URL, user)
    }
    updateUser(user, userId){
        return axios.put(USERS_REST_API_URL + '/' + userId, user);
    }
    deleteUser(userId){
        return axios.delete(USERS_REST_API_URL + '/' + userId);
    }
}

export default new UserService()