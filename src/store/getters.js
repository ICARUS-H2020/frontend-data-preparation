import * as R from 'ramda';

export const isAdmin = (state) => state.user && state.user.userRoles && state.user.userRoles.includes('SUPERADMIN');
export const isOrgAdmin = (state) =>
    state.user && state.user.userRoles && state.user.userRoles.includes('ORGANISATIONADMIN');
export const getNotifications = (state) => state.notifications || [];
export const unreadNotifications = (state) =>
    R.filter((notification) => notification.seen_on === null, state.notifications || []);
export const userDisplayName = (state) => {
    if (state.user) {
        return state.user.firstname && state.user.lastname
            ? `${state.user.firstname} ${state.user.lastname}`
            : state.user.email;
    }
    return '';
};

export const dataModel = (state) => state.dataModel;
export const flatModel = (state) => state.flatModel;

export const getMarketplaceFiltersObject = (state) => state.marketplaceFiltersObject;
export const getMarketplaceItems = (state) => state.marketplaceItems || [];

export const getFavoritesFiltersObject = (state) => state.favoritesFiltersObject;
export const getFavoritesItems = (state) => state.favoritesItems || [];

export const userDTO = (state) => {
    if (state.user) {
        const name = `${state.user.firstname} ${state.user.lastname}`;
        return JSON.stringify({
            id: state.user.id,
            name,
        });
    }

    return null;
};
export const organizationDTO = (state) =>
    state.organization ? JSON.stringify(R.pick(['id', 'businessname'], state.organization)) : null;

export const getMarketplaceQueryBuilderObject = (state) => state.marketplaceQueryBuilderObject;
