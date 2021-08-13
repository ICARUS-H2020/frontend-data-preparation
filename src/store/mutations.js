import { clone, keys, find, propEq, forEach } from 'ramda';

export const clearUser = (state) => {
    state.signedIn = false;
    state.user = null;
    state.csrf = null;
};

export const clearState = (state) => {
    // eslint-disable-next-line
    for (const k of keys(state)) {
        if (k === 'headercolor' || k === 'pagecolor' || k === 'sidebarcolor' || k === 'eth') {
            // Do nothing
        } else if (k === 'notifications') {
            state[k] = [];
        } else {
            state[k] = null;
        }
    }
};

export const refresh = (state, csrf) => {
    state.signedIn = true;
    state.csrf = csrf;
};

export const setUser = (state, { user, csrf }) => {
    state.user = clone(user);
    state.csrf = csrf;
    state.signedIn = true;
};

export const setOrganization = (state, { organization }) => {
    state.organization = clone(organization);
    if (organization.id === 1) {
        state.sidebarcolor = 'bg-royal text-lighter';
    } else {
        state.sidebarcolor = 'bg-night-sky text-lighter';
    }
};

export const setSidebarColor = (state, color) => {
    state.sidebarcolor = color;
};

export const setHeaderColor = (state, color) => {
    state.headercolor = color;
};

export const setSubtitle = (state, subtitle) => {
    state.subtitle = subtitle;
};

export const setDataModel = (state, model) => {
    state.dataModel = model;
};

export const setFlatModel = (state, model) => {
    state.flatModel = model;
};

export const toggleMarketplaceFiltersVisible = (state, filtersShown) => {
    state.marketplaceFiltersVisible = filtersShown;
};

export const setMarketplaceFiltersObject = (state, filtersObject) => {
    state.marketplaceFiltersObject = filtersObject;
};

export const setMarketplaceItems = (state, items) => {
    state.marketplaceItems = items;
};

export const setNotifications = (state, notifications) => {
    state.notifications = notifications;
};

export const markNotificationAsSeen = (state, notificationId) => {
    const notification = find(propEq('_notif_id', notificationId))(state.notifications);
    notification.seen_on = '';
};

export const markAllNotificationsAsSeen = (state) => {
    forEach((notification) => {
        notification.seen_on = '';
    }, state.notifications);
};

export const deleteNotification = (state, notificationId) => {
    const idx = state.notifications.findIndex((obj) => obj._notif_id === notificationId);
    if (~idx) {
        state.notifications.splice(idx, 1);
    }
};

export const newNotification = (state, payload) => {
    state.notifications.unshift(clone(payload));
};

export const setCopiedConcept = (state, copiedConcept) => {
    state.copiedConcept = copiedConcept;
};

export const toggleFavoritesFiltersVisible = (state, filtersShown) => {
    state.favoritesFiltersVisible = filtersShown;
};

export const setFavoritesFiltersObject = (state, filtersObject) => {
    state.favoritesFiltersObject = filtersObject;
};

export const setFavoritesItems = (state, items) => {
    state.favoritesItems = items;
};

export const setMarketplaceQueryBuilderObject = (state, queryObject) => {
    state.marketplaceQueryBuilderObject = queryObject;
};

export const toggleMarketplaceQueryBuilderVisible = (state, queryShown) => {
    state.marketplaceQueryBuilderVisible = queryShown;
};
