<template>
    <div class="h-100 bg-animation" :class="$store.state.pagecolor">
        <div class="d-flex h-75 justify-content-center align-items-center">
            <b-col md="4" class="mx-auto app-login-box">
                <div class="app-logo-inverse mx-auto mb-3" />

                <div>
                    <div class="modal-content">
                        <div class="modal-body pl-5 pr-5">
                            <div class="h5 modal-title text-center">
                                <h4 class="mt-2">
                                    <div>Forgot your password?</div>
                                    <span>Use the form below to recover it.</span>
                                </h4>
                            </div>
                            <div class="text-center pb-3" v-show="showMessage">
                                <h6>
                                    <b>Reset code was sent to {{ emailSentTo }}.</b>
                                </h6>
                            </div>
                            <b-form-group id="emailInput" label-for="email">
                                <b-form-input
                                    id="email"
                                    type="email"
                                    name="email"
                                    v-model="email"
                                    placeholder="Email"
                                    @keyup.enter="checkEnterKeyFunctionality"
                                    v-validate="'required|email'"
                                    :class="{ 'is-invalid': errors.has('email') }"
                                    required
                                />
                                <div class="invalid-feedback" v-if="errors.has('email')">
                                    {{ errors.first('email') }}
                                </div>
                            </b-form-group>
                        </div>
                        <div class="modal-footer clearfix">
                            <div class="float-left">
                                <router-link :to="{ name: 'login' }" class="btn btn-link">Sign in</router-link>
                            </div>
                            <div class="float-right">
                                <b-button
                                    variant="warning shadow"
                                    :disabled="disableRecoverPasswordButton"
                                    @click="submit"
                                >
                                    Recover Password
                                </b-button>
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
import { Auth } from '@/api';

export default {
    name: 'RecoverPassword',
    data() {
        return {
            email: '',
            showMessage: false,
            emailSentTo: '',
            disableRecoverPasswordBtn: false,
        };
    },
    computed: {
        disableRecoverPasswordButton() {
            return this.email === this.emailSentTo && this.disableRecoverPasswordBtn;
        },
    },
    methods: {
        checkEnterKeyFunctionality() {
            if (!this.disableRecoverPasswordButton) {
                this.submit();
            }
        },
        submit() {
            this.$validator.validateAll().then((success) => {
                if (success) {
                    this.disableRecoverPasswordBtn = true;
                    this.recover();
                }
            });
        },
        async recover() {
            try {
                const payload = { email: this.email };
                await Auth.forgotPassword(payload);
                this.emailSentTo = this.email;
                this.showMessage = true;
            } catch (error) {
                this.emailSentTo = '';
                this.showMessage = false;
                this.disableRecoverPasswordBtn = false;
                if (error.response && error.response.data && error.response.data.message) {
                    this.errors.add({
                        field: 'email',
                        msg: error.response.data.message,
                    });
                }
            }
        },
    },
};
</script>
