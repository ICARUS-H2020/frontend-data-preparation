import { secured, flask } from './axios';

const resource = '/virtual-dataset';

export default {
    all: () => secured.get(`${resource}/organization`),
    create: (payload) => secured.post(`${resource}`, payload),
    delete: (id) => secured.delete(`${resource}/${id}`),
    get: (id) => secured.get(`${resource}/${id}`),
    canDownload: (id) => flask.get(`${resource}/download?vd_id=${id}&check_metadata=${true}&check_contracts=${true}`),
    download: (id) => secured.post(`${resource}/download/${id}`),
    update: (id, payload) => secured.put(`${resource}/${id}`, payload),
};
