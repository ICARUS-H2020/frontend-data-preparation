<template>
    <b-modal
        id="importWallet"
        variant="primary"
        size="lg"
        header-bg-variant="primary"
        header-text-variant="light"
        :title="'Import an existing Ethereum wallet'"
        :ok-title="'Import'"
        @ok="importWallet"
    >
        <p>
            You can import an existing wallet by entering the private key. In addition, a password is required to be
            used for signing all contracts within the ICARUS platform
        </p>

        <b-form-group
            label-for="privateKey"
            label="Private Key"
            description="Private key will not leave your browser and will not be stored"
        >
            <b-form-input
                name="privateKey"
                type="password"
                v-model="privateKey"
                placeholder="Enter private key"
                v-validate="'required'"
                :class="{ 'is-invalid': errors.has('privateKey') }"
                :disabled="isLoading"
            />
            <div class="invalid-feedback" v-if="errors.has('privateKey')">
                {{ errors.first('privateKey') }}
            </div>
        </b-form-group>

        <b-form-group label-for="walletPassword" label="Password">
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

        <p class="text-center" v-if="isLoading">Importing and Encrypting Wallet...</p>
        <b-progress :value="progress" :max="100" show-progress animated v-if="isLoading"></b-progress>
    </b-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { Organization, Ethereum } from '@/api';

export default {
    name: 'ImportWalletModal',
    data() {
        return {
            password: '',
            privateKey: '',
            progress: 0,
            isLoading: false,
        };
    },
    computed: { ...mapGetters('eth', ['address']) },
    methods: {
        walletProgress(progress) {
            this.progress = Math.round(progress * 100);
        },
        async importWallet(event) {
            event.preventDefault();
            const result = await this.$validator.validateAll();
            if (result) {
                this.isLoading = true;
                try {
                    await this.$store.dispatch('eth/importWallet', {
                        privateKey: this.privateKey,
                        password: this.password,
                        callback: this.walletProgress,
                    });

                    this.isLoading = false;
                    this.privateKey = '';
                    this.password = '';
                    this.$validator.reset();
                    this.$bvModal.hide('importWallet');

                    await Organization.initWallet({
                        ethwallet: this.$store.state.eth.wallet,
                        ethaddress: this.address,
                    });

                    await Ethereum.sendEthersToWallet({
                        ethaddress: this.address,
                    });
                } catch (e) {
                    this.errors.add({
                        field: 'privateKey',
                        msg: 'Invalid key',
                    });
                    this.isLoading = false;
                }
            }
        },
    },
};
</script>
