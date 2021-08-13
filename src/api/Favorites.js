import { secured } from './axios';

const resource = '/favorites';

export default {
    all: () => secured.get(`${resource}/liked-datasets/`),
    like: (id) => secured.put(`${resource}/dataset/${id}/like/`),
    unlike: (id) => secured.delete(`${resource}/dataset/${id}/unlike/`),
    allApps: () => secured.get(`${resource}/liked-applications/`),
    likeApp: (id) => secured.put(`${resource}/application/${id}/like/`),
    unlikeApp: (id) => secured.delete(`${resource}/application/${id}/unlike/`),
};
