import { secured } from './axios';

const resource = '/organization';

export default {
    all: () => secured.get(`${resource}/all`), // Only usable by superadmin
    mine: () => secured.get(`${resource}`),
    create: (payload) => secured.post(`${resource}`, payload), // Only usable by superadmin
    delete: (id) => secured.delete(`${resource}/${id}`), // Only usable by superadmin
    get: (id) => secured.get(`${resource}/${id}`),
    members: (id) => {
        if (id) {
            return secured.get(`${resource}/users/${id}`);
        }
        return secured.get(`${resource}/users/`);
    },
    update: (payload) => secured.put(`${resource}`, payload), // Only usable by organization admin
    updateOrganization: (id, payload) => secured.put(`${resource}/${id}`, payload), // Only usable by superadmin
    verify: (id) => secured.patch(`${resource}/verify/${id}`), // Only usable by superadmin
    askForMoreInfo: (id, reason) => secured.post(`${resource}/additional-information/${id}`, reason), // Only usable by superadmin
    reject: (id, reason) => secured.patch(`${resource}/reject/${id}`, reason), // Only usable by superadmin
    enable: (id) => secured.patch(`${resource}/enable/${id}`), // Only usable by superadmin
    disable: (id) => secured.patch(`${resource}/disable/${id}`), // Only usable by superadmin
    updateLogoImage: (payload) => secured.put(`${resource}/upload-logo-image`, payload), // Only usable by organization admin
    getLogoImage: (id) => secured.get(`${resource}/logo-image/${id}`),
    updateBannerImage: (payload) => secured.put(`${resource}/upload-banner-image`, payload), // Only usable by organization admin
    getBannerImage: (id) => secured.get(`${resource}/banner-image/${id}`),
    initWallet: (payload) => secured.put(`${resource}/init-ethereum`, payload),
};
