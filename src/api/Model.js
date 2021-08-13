import { secured, flask } from './axios';

const model = '/icarus-model';

export default {
    get: () => secured.get(`${model}`),
    getDataModel: () => flask.get('data-model'),
    getFlatModel: () => flask.get('flat-model'),
    update: () => secured.put(`${model}`),
    search: (payload) => flask.post('model-search', payload),
};
