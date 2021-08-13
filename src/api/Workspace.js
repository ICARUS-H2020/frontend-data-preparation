import axios from 'axios';

const handler = axios.create({
    baseURL: process.env.VUE_APP_WORKSPACE_URL,
});

export default {
    autocomplete: (payload) => handler.post('/orchestration/autocompletion?dataStore=hive', payload),
    parse: (payload) => handler.post('/orchestration/parse', payload),
    workflows: () => handler.get('/orchestration/workflows?mode=BATCH'),
    createApplication: (data) => handler.post('/v2/bundle/bdas', data),
    updateApplication: (id, data) => handler.patch(`/v2/bundle/bdas/${id}`, data),
};
