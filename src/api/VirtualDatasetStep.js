import { flask, secured } from './axios';

const resource = '/virtual-dataset-step';

export default {
    all: (virtualDatasetId) => secured.get(`${resource}/all/${virtualDatasetId}`),
    create: (payload) => secured.post(`${resource}`, payload),
    delete: (id) => secured.delete(`${resource}/${id}`),
    get: (id) => secured.get(`${resource}/${id}`),
    update: (id, payload) => secured.put(`${resource}/${id}`, payload),
    patch: (id, payload) => secured.patch(`${resource}/${id}`, payload),

    processStep: (payload) => flask.post('/data-prep/process-step', payload),
    deleteStep: (payload) => flask.post('/data-prep/delete-step', payload),
    getStepInfo: (payload) => flask.post('/data-prep/step-info ', payload),
    processStepFinalize: (payload) => flask.post('/data-prep/finalize', payload),
};
