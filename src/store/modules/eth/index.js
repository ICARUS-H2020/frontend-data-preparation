import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

export default {
    namespaced: true,
    state: {
        contractAddress: process.env.VUE_APP_ETH_CONTRACT,
        network: null,
        provider: null,
        wallet: null,
    },
    actions,
    getters,
    mutations,
};
