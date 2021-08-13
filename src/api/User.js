import { secured } from './axios';

const resource = '/user';

export default {
    me: () => secured.get(`${resource}`),
    get: (id) => secured.get(`${resource}/${id}`),
    all: () => secured.get(`${resource}/all`),
    update: (payload) => secured.put(`${resource}`, payload),
    changePassword: (payload) => secured.put(`${resource}/password`, payload),
    enable: (id) => secured.patch(`${resource}/enable/${id}`), // Only usable by organization admin, superadmin
    disable: (id) => secured.patch(`${resource}/disable/${id}`), // Only usable by organization admin, superadmin
    invite: (payload) => secured.post(`${resource}-invites`, payload), // Only usable by organization admin
    getInvitations: () => secured.get(`${resource}-invites`), // Only usable by organization admin
    revokeInvitation: (id) => secured.delete(`${resource}-invites/${id}`), // Only usable by organization admin
};
