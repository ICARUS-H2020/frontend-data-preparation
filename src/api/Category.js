import { secured } from './axios';

const resource = '/category';

export default {
    all: () => secured.get(`${resource}/all`),
};
