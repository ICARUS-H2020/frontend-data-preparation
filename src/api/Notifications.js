import { notifications, flask } from './axios';

const resource = '/notifications';

export default {
    get: (size, page) => notifications.get(`${resource}?size=${size}&page=${page}&sort=_created_on,desc`),
    delete: (id) => notifications.delete(`${resource}/${id}`),
    seen: (id) => notifications.put(`${resource}/${id}/seen/`),
    seenAll: () => notifications.put(`${resource}/seen/`),

    publish: (payload) => flask.post(`${resource}/publish`, payload),
};
