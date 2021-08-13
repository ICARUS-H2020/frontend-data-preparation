<template>
    <div>
        <div class="h-100 bg-animation" :class="$store.state.pagecolor">
            <div class="d-flex h-75 justify-content-center align-items-center">
                <b-col md="4" class="mx-auto app-login-box">
                    <div class="app-logo-inverse mx-auto mb-3" />

                    <div>
                        <div class="modal-content">
                            <div class="modal-header text-center pr-5 pl-5">
                                <div class="modal-title w-100">
                                    <h4 class="mt-3 mb-2">Change Password</h4>
                                </div>
                            </div>
                            <div class="modal-body p-5">
                                <b-form-group label-for="email">
                                    <b-form-input
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        disabled
                                        v-model="email"
                                        v-validate="'required|email'"
                                        :class="{ 'is-invalid': errors.has('email') }"
                                    />
                                    <div class="invalid-feedback" v-if="errors.has('email')">
                                        {{ errors.first('email') }}
                                    </div>
                                </b-form-group>
                                <b-form-group class="pb-1" label-for="passwordToken">
                                    <b-form-input
                                        name="passwordToken"
                                        type="text"
                                        placeholder="Reset Code"
                                        disabled
                                        v-model="passwordToken"
                                    />
                                    <small class="form-text text-muted float-right">
                                        <a href="javascript:void(0)" v-b-modal.codeModal>What is this?</a>
                                    </small>
                                </b-form-group>
                                <div class="row pt-2">
                                    <div class="col-md-6 pr-2">
                                        <b-form-group label-for="password">
                                            <b-form-input
                                                name="password"
                                                type="password"
                                                v-model="new_password"
                                                placeholder="New Password"
                                                v-validate="'required'"
                                                :class="{ 'is-invalid': errors.has('password') }"
                                                ref="password"
                                            />
                                            <div class="invalid-feedback" v-if="errors.has('password')">
                                                {{ errors.first('password') }}
                                            </div>
                                        </b-form-group>
                                    </div>
                                    <div class="col-md-6 pl-2">
                                        <b-form-group label-for="repeat_password">
                                            <b-form-input
                                                name="repeat_password"
                                                v-model="repeat_password"
                                                type="password"
                                                :class="{ 'is-invalid': errors.has('repeat_password') }"
                                                placeholder="Repeat New Password"
                                                v-validate="'required|confirmed:password'"
                                            />
                                            <div class="invalid-feedback" v-if="errors.has('repeat_password')">
                                                {{ errors.first('repeat_password') }}
                                            </div>
                                        </b-form-group>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer d-block text-center">
                                <b-button type="button" class="btn-wide btn-warning btn-shadow" @click="submit">
                                    Change Password
                                </b-button>
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

        <b-modal id="codeModal" title="What is 'Reset Code'?" ok-only>
            <p>
                The Reset Code is the code included in the password recovery link you have received via email and it is
                required by the ICARUS platform to reset your password.
            </p>
        </b-modal>
    </div>
</template>

<script>
import { Auth } from '@/api';

export default {
    name: 'SetNewPassword',
    data() {
        return {
            email: '',
            passwordToken: '',
            new_password: '',
            repeat_password: '',
        };
    },
    created() {
        if (this.$route.query.email) {
            this.email = this.$route.query.email.trim();
        } else {
            this.$router.push('/login');
        }
        if (this.$route.query.password_code) {
            this.passwordToken = this.$route.query.password_code.trim();
        } else {
            this.$router.push('/login');
        }
    },
    methods: {
        submit() {
            this.$validator.validateAll().then((success) => {
                if (success) {
                    this.changePassword();
                }
            });
        },
        async changePassword() {
            try {
                const payload = {
                    email: this.email,
                    passwordToken: this.passwordToken,
                    newPassword: this.new_password,
                };
                await Auth.recoverPassword(payload);
                this.$router.push('/login');
            } catch (error) {
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
