<template>
    <div class="h-100 bg-animation" :class="$store.state.pagecolor">
        <div class="d-flex h-75 justify-content-center align-items-center">
            <b-col md="4" class="mx-auto app-login-box">
                <div class="app-logo-inverse mx-auto mb-3" />

                <div>
                    <div class="modal-content">
                        <div class="modal-header text-center pr-5 pl-5">
                            <div class="modal-title w-100">
                                <h4 class="mt-3 mb-2">User Login</h4>
                            </div>
                        </div>
                        <div class="modal-body pl-5 pr-5 pb-4 pt-5">
                            <b-form-group id="emailInput" class="pb-2" label-for="email">
                                <b-form-input
                                    id="email"
                                    type="text"
                                    name="email"
                                    v-model="user.email"
                                    placeholder="Email"
                                    @keyup.enter="submit"
                                    v-validate="'required'"
                                    :class="{ 'is-invalid': errors.has('email') }"
                                    required
                                />
                                <div class="invalid-feedback" v-if="errors.has('email')">
                                    {{ errors.first('email') }}
                                </div>
                            </b-form-group>
                            <b-form-group id="passwordInput" class="pb-2" label-for="password">
                                <b-form-input
                                    id="password"
                                    type="password"
                                    name="password"
                                    v-model="user.password"
                                    placeholder="Password"
                                    @keyup.enter="submit"
                                    v-validate="'required'"
                                    :class="{ 'is-invalid': errors.has('password') }"
                                    required
                                />
                                <div class="invalid-feedback" v-if="errors.has('password')">
                                    {{ errors.first('password') }}
                                </div>
                            </b-form-group>
                            <div class="divider" />
                            <div class="mb-0 text-muted">
                                No account?
                                <router-link :to="{ name: 'register-organization' }">
                                    <strong>Register your organization</strong>
                                </router-link>
                                !
                            </div>
                        </div>
                        <div class="modal-footer clearfix">
                            <div class="float-left">
                                <router-link :to="{ name: 'password-recovery' }" class="btn btn-link">
                                    Recover Password
                                </router-link>
                            </div>
                            <div class="float-right">
                                <b-button variant="warning shadow" @click="submit">Sign In</b-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center text-white opacity-8 mt-3">
                    Copyright &copy; {{ new Date().getFullYear() }}
                    <a href="https://www.icarus2020.aero" class="text-warning" target="_BLANK">ICARUS Consortium</a>
                    . All rights reserved.
                </div>
            </b-col>
        </div>
    </div>
</template>

<script>
import { Auth, User, Organization, Model } from '@/api';
import { SET_USER, SET_ORGANIZATION, SET_FLAT_MODEL, SET_DATA_MODEL } from '@/store/mutation-types';
import { SET_WALLET, SET_NETWORK } from '@/store/modules/eth/mutation-types';
import { mapGetters } from 'vuex';

export default {
    name: 'Login',
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
        };
    },
    computed: {
        ...mapGetters(['isAdmin']),
    },
    methods: {
        submit() {
            this.$validator.validateAll().then((success) => {
                if (success) {
                    this.login();
                }
            });
        },
        async login() {
            try {
                await Auth.login(this.user);
                const { data: user } = await User.me();
                this.$store.commit(SET_USER, { user });
                try {
                    if (!this.isAdmin) {
                        const { data: organization } = await Organization.mine();
                        this.$store.commit(SET_ORGANIZATION, { organization });
                        this.$store.commit(SET_WALLET, organization.ethwallet);
                    }

                    Promise.all([Model.getDataModel(), Model.getFlatModel()]).then(
                        ([{ data: model }, { data: flatModel }]) => {
                            this.$store.commit(SET_DATA_MODEL, model);
                            this.$store.commit(SET_FLAT_MODEL, flatModel);
                        },
                    );

                    // Load ethereum provider and network
                    await this.$store.dispatch('eth/createProvider', process.env.VUE_APP_ETH_NODE);
                    if (this.$store.state.eth.provider) {
                        await this.$store.dispatch('eth/loadNetwork');
                    } else {
                        this.$store.commit(SET_NETWORK, null);
                    }
                } catch (e) {
                    // Do nothing
                }
                this.$router.push({ name: 'home' });
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.errors.add({
                        field: 'password',
                        msg: error.response.data.message,
                    });
                }
            }
        },
    },
};
</script>
