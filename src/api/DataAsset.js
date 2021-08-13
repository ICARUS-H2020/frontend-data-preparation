import { secured, flask } from './axios';

const resource = '/data-asset';

export default {
    all: () => secured.get(`${resource}/all`),
    bought: () => secured.get(`${resource}/organization/all/bought`),
    boughtNonCompleted: (page, size) =>
        secured.get(`${resource}/organization/all/bought/non-completed?page=${page}&size=${size}`),
    get: (id) => secured.get(`${resource}/${id}`),
    update: (id, payload) => secured.put(`${resource}/${id}`, payload),
    organizationAll: (id) => secured.get(`${resource}/organization/${id}/all`),
    mine: () => secured.get(`${resource}/user/all`),
    getAuthorization: (id) => secured.get(`/authorization/${id}`),
    getFilters: () => secured.get('/authorization/filters'),
    updateAuthorization: (id, payload) => secured.put(`/authorization/${id}`, payload),
    search: (params) => secured.get(`${resource}/search/`, { params }),
    updateImage: (id, payload) => secured.put(`${resource}/upload-coverphoto-image/${id}`, payload),
    getImage: (id) => secured.get(`${resource}/coverphoto-image/${id}`),
    getPDF: (id) => flask.get(`/terms-pdf?asset_id=${id}`),
};
