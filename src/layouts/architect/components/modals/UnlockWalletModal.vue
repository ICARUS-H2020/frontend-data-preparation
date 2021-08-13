<template>
    <div>
        <b-modal
            :id="id"
            variant="primary"
            header-bg-variant="primary"
            header-text-variant="light"
            :title="'Unlock Ethereum wallet'"
            :ok-title="'Unlock'"
            @ok="unlockWallet"
        >
            <p>Access to your Ethereum wallet is required before you continue. Please enter your password.</p>
            <b-form-group label-for="walletPassword">
                <b-form-input
                    name="walletPassword"
                    type="password"
                    v-model="password"
                    placeholder="Enter wallet password"
                    v-validate="'required'"
                    :class="{ 'is-invalid': errors.has('walletPassword') }"
                    :disabled="isLoading"
                />
                <div class="invalid-feedback" v-if="errors.has('walletPassword')">
                    {{ errors.first('walletPassword') }}
                </div>
            </b-form-group>

            <p class="text-center" v-if="isLoading">Unlocking Wallet...</p>
            <b-progress :value="progress" :max="100" show-progress animated v-if="isLoading"></b-progress>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { Wallet } from 'ethers';

export default {
    name: 'UnlockWalletModal',
    props: {
        id: {
            type: String,
            default: null,
        },
        callback: {
            type: Function,
            default: null,
        },
    },
    data() {
        return {
            myWallet: null,
            password: '',
            progress: 0,
            isLoading: false,
        };
    },
    computed: {
        ...mapState('eth', ['provider', 'wallet']),
    },
    methods: {
        walletProgress(progress) {
            this.progress = Math.round(progress * 100);
        },
        async unlockWallet(event) {
            event.preventDefault();
            const result = await this.$validator.validateAll();

            if (result) {
                this.isLoading = true;
                try {
                    const wallet = await Wallet.fromEncryptedJson(this.wallet, this.password, this.walletProgress);
                    this.myWallet = wallet.connect(this.provider);
                    this.$bvModal.hide(this.id);
                    this.callback(this.myWallet);
                } catch (e) {
                    this.isLoading = false;
                    this.errors.add({
                        field: 'walletPassword',
                        msg: 'Invalid password',
                    });
                }
            }
        },
    },
};
</script>
