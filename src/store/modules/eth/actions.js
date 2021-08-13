import { ethers } from 'ethers';
import { SET_NETWORK, SET_PROVIDER, SET_WALLET } from './mutation-types';

// Create a provider in store
export const createProvider = async ({ commit }, url) => {
    const provider = await new ethers.providers.JsonRpcProvider(url);
    commit(SET_PROVIDER, provider, { root: true });
};

export const loadNetwork = async ({ state, commit }) => {
    try {
        const network = await state.provider.getNetwork();
        commit(SET_NETWORK, network, { root: true });
    } catch (_) {
        commit(SET_NETWORK, null, { root: true });
    }
};

// Create a wallet, encrypt it and store it in state
export const createWallet = async ({ commit }, { password, callback }) => {
    const randomWallet = await ethers.Wallet.createRandom(ethers.utils.randomBytes(32));
    const encWallet = await randomWallet.encrypt(password, callback);
    commit(SET_WALLET, encWallet, { root: true });
};

export const importWallet = async ({ commit }, { privateKey, password, callback }) => {
    const wallet = new ethers.Wallet(privateKey);
    const encWallet = await wallet.encrypt(password, callback);
    commit(SET_WALLET, encWallet, { root: true });
};
