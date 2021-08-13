import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';
import state from './state';
import { eth } from './modules';
import { abilityPlugin, ability as appAbility } from './plugins/ability';

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    key: 'icarus',
    reducer: (s) => ({
        // Only the following values are persisted in local storage
        sidebarcolor: s.sidebarcolor,
        user: s.user,
        organization: s.organization,
        signedIn: s.signedIn,
    }),
});

Vue.use(Vuex);
export const ability = appAbility;

const store = new Vuex.Store({
    actions,
    getters,
    mutations,
    state,
    modules: { eth }, // Create modules in the appropritate directory, and load them here
    plugins: [vuexLocal.plugin, abilityPlugin],
});

export default store;
