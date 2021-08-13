import axios from 'axios';
import store from '@/store';
import router from '@/router';
import { CLEAR_STATE } from '@/store/mutation-types';

const baseURL = process.env.VUE_APP_API_URL;
const flaskURL = process.env.VUE_APP_FLASK_URL;
const notificationsURL = process.env.VUE_APP_NOTIFICATIONS_URL;
const recommendationURL = process.env.VUE_APP_RECOMMENDATION_URL;
const usageanalyticsURL = process.env.VUE_APP_USAGEANALYTICS_URL;

const secured = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const plain = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const flask = axios.create({
    baseURL: flaskURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const notifications = axios.create({
    baseURL: notificationsURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const recommendation = axios.create({
    baseURL: recommendationURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const usageanalytics = axios.create({
    baseURL: usageanalyticsURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach CSRF token to all secure requests, except GET/OPTIONS ones
secured.interceptors.request.use((config) => {
    const method = config.method.toUpperCase();
    if (method !== 'OPTIONS' && method !== 'GET') {
        config.headers = {
            ...config.headers,
            // 'X-CSRF-TOKEN': store.csrf,
        };
    }
    return config;
});

const interceptError = (error) => {
    // if (error.response && error.response.status === 404) {
    //     router.push({ name: 'error404' });
    // }
    if (error.response && error.response.status === 500) {
        router.push({ name: 'error500' });
    }
    if (error.response && error.response.config && error.response.status === 401) {
        // clear state and redirect to signin in
        store.commit(CLEAR_STATE);
        window.location.replace('/');
    }

    return Promise.reject(error);
};

secured.interceptors.response.use(null, interceptError);
flask.interceptors.response.use(null, interceptError);

export { flask, plain, secured, notifications, recommendation, usageanalytics };
