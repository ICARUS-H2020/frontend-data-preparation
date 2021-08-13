import { ethers } from 'ethers';

export const address = (state) => {
    if (state.wallet) {
        const wallet = JSON.parse(state.wallet);
        return wallet.address;
    }

    return null;
};

export const hasWallet = (state) => !!state.wallet;

export const decryptedWallet = (state) => async ({ password, callback }) => {
    const wallet = await ethers.Wallet.fromEncryptedJson(JSON.stringify(state.wallet), password, callback);
    return wallet;
};

export const networkName = (state) => {
    if (state.network) {
        switch (state.network.chainId) {
            case 1:
                return 'Main Ethereum Network';
            case 3:
                return 'Ropsten Test Network';
            case 4:
                return 'Rinkeby Test Network';
            case 5:
                return 'Goerli Test Network';
            case 42:
                return 'Kovan Test Network';
            case 4224:
                return 'ICARUS Ethereum Network';
            default:
                return 'Unknown Network';
        }
    }

    return null;
};
