<template>
    <b-modal
        id="createWallet"
        variant="primary"
        size="lg"
        header-bg-variant="primary"
        header-text-variant="light"
        :title="'Create a new Ethereum wallet'"
        :ok-title="'Create'"
        @ok="createWallet"
    >
        <p>
            Enter a password to encrypt your wallet. This password will be used for signing all contracts within the
            ICARUS platform.
        </p>
        <b-form-group label-for="walletPassword">
            <b-form-input
                name="walletPassword"
                type="password"
                v-model="password"
                placeholder="Enter wallet password"
                v-validate="'required|min:8|strong_password'"
                :class="{ 'is-invalid': errors.has('walletPassword') }"
                :disabled="isLoading"
            />
            <div class="invalid-feedback" v-if="errors.has('walletPassword')">
                {{ errors.first('walletPassword') }}
            </div>
        </b-form-group>

        <p class="text-center" v-if="isLoading">Generating and Encrypting Wallet...</p>
        <b-progress :value="progress" :max="100" show-progress animated v-if="isLoading"></b-progress>
    </b-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { Organization, Ethereum } from '@/api';

export default {
    name: 'CreateWalletModal',
    data() {
        return {
            password: '',
            progress: 0,
            isLoading: false,
        };
    },
    computed: { ...mapGetters('eth', ['address']) },
    methods: {
        walletProgress(progress) {
            this.progress = Math.round(progress * 100);
        },
        async createWallet(event) {
            event.preventDefault();
            const result = await this.$validator.validateAll();

            if (result) {
                this.isLoading = true;
                await this.$store.dispatch('eth/createWallet', {
                    password: this.password,
                    callback: this.walletProgress,
                });
                this.isLoading = false;
                this.password = '';
                this.$validator.reset();
                this.$bvModal.hide('createWallet');

                await Organization.initWallet({
                    ethwallet: this.$store.state.eth.wallet,
                    ethaddress: this.address,
                });

                await Ethereum.sendEthersToWallet({
                    ethaddress: this.address,
                });
            }
        },
    },
};
</script>
