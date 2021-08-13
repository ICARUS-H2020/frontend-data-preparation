import { plain, secured } from './axios';

export default {
    login: (payload) => plain.post('/login', payload),
    logout: () => secured.post('/logout'),
    register: (payload) => plain.post('/user', payload),
    forgotPassword: (payload) => plain.post('/user/forgot-password', payload),
    recoverPassword: (payload) => plain.post('/user/recover-password', payload),
};
