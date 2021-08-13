<template>
    <b-modal
        :id="title"
        variant="primary"
        size="lg"
        header-bg-variant="primary"
        header-text-variant="light"
        title="Edit user profile"
        @ok="validateData"
    >
        <div class="row">
            <div class="position-relative form-group col-sm-6">
                <label for="firstname">First Name</label>
                <input
                    name="firstname"
                    placeholder="Enter first name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.has('firstname') }"
                    v-model="userFormData.firstname"
                    v-validate="'required'"
                    required
                />
                <div class="invalid-feedback" v-if="errors.has('firstname')">
                    {{ errors.first('firstname') }}
                </div>
            </div>
            <div class="position-relative form-group col-sm-6">
                <label for="lastname">Last Name</label>
                <input
                    name="lastname"
                    placeholder="Enter last name"
                    class="form-control"
                    :class="{ 'is-invalid': errors.has('lastname') }"
                    v-model="userFormData.lastname"
                    v-validate="'required'"
                    required
                />
                <div class="invalid-feedback" v-if="errors.has('lastname')">
                    {{ errors.first('lastname') }}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="position-relative form-group col-sm-6">
                <label for="username">Username</label>
                <input
                    name="username"
                    placeholder="Enter username"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.has('username') }"
                    v-model="userFormData.username"
                    v-validate="'required'"
                    disabled
                    required
                />
                <div class="invalid-feedback" v-if="errors.has('username')">
                    {{ errors.first('username') }}
                </div>
            </div>
            <div class="position-relative form-group col-sm-6">
                <label for="email">Email</label>
                <input
                    name="email"
                    placeholder="Enter email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.has('email') }"
                    v-model="userFormData.email"
                    v-validate="'required'"
                    disabled
                    required
                />
                <div class="invalid-feedback" v-if="errors.has('email')">
                    {{ errors.first('email') }}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="position-relative form-group col-sm-6">
                <label for="phone">Phone</label>
                <input
                    name="phone"
                    placeholder="Enter phone"
                    type="text"
                    class="form-control"
                    v-model="userFormData.phone"
                />
            </div>
            <div class="position-relative form-group col-sm-6">
                <label for="position">Position</label>
                <input
                    name="position"
                    placeholder="Enter position"
                    type="text"
                    class="form-control"
                    v-model="userFormData.position"
                />
            </div>
        </div>
        <div class="row">
            <div class="position-relative form-group col-sm-6" v-if="userFormData.organizationid">
                <label for="organization">Organization</label>
                <input
                    name="organization"
                    placeholder="Enter organization"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.has('organization') }"
                    v-model="organizationFormData.businessname"
                    v-validate="'required'"
                    disabled
                    v-if="organizationFormData"
                />
                <input
                    name="organization"
                    placeholder="Enter organization"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.has('organization') }"
                    v-model="
                        organizations.find((organization) => organization.id === userFormData.organizationid)
                            .businessname
                    "
                    v-validate="'required'"
                    disabled
                    v-else
                />
                <div class="invalid-feedback" v-if="errors.has('organization')">
                    {{ errors.first('organization') }}
                </div>
            </div>
            <div class="position-relative form-group col-sm-6">
                <label for="department">Department</label>
                <input
                    name="department"
                    placeholder="Enter department"
                    type="text"
                    class="form-control"
                    v-model="userFormData.department"
                />
            </div>
        </div>
        <div v-if="editOwnProfile">
            <hr />
            <b-form-group label="Change Password">
                <div class="row" v-if="password">
                    <div class="col-3">
                        <input
                            name="currentPassword"
                            placeholder="Current password"
                            type="password"
                            class="form-control form-control-sm"
                            :class="{ 'is-invalid': errors.has('passwordForm.currentPassword') }"
                            data-vv-scope="passwordForm"
                            v-model="password.old_password"
                            v-validate="'required'"
                        />
                        <div class="invalid-feedback" v-if="errors.has('passwordForm.currentPassword')">
                            {{ errors.first('passwordForm.currentPassword') }}
                        </div>
                    </div>
                    <div class="col-3">
                        <input
                            name="newPassword"
                            placeholder="New password"
                            type="password"
                            :class="{ 'is-invalid': errors.has('passwordForm.newPassword') }"
                            class="form-control form-control-sm"
                            v-model="password.new_password"
                            data-vv-scope="passwordForm"
                            v-validate="{ required: true, min: 8, is: password.verify_password }"
                            vid="newPassword"
                        />
                        <div class="invalid-feedback" v-if="errors.has('passwordForm.newPassword')">
                            {{ errors.first('passwordForm.newPassword') }}
                        </div>
                    </div>
                    <div class="col-3">
                        <input
                            name="verifyPassword"
                            placeholder="Verify new password"
                            type="password"
                            class="form-control form-control-sm"
                            :class="{ 'is-invalid': errors.has('passwordForm.verifyPassword') }"
                            data-vv-scope="passwordForm"
                            v-model="password.verify_password"
                            v-validate="{ required: true }"
                        />
                        <div class="invalid-feedback" v-if="errors.has('passwordForm.verifyPassword')">
                            {{ errors.first('passwordForm.verifyPassword') }}
                        </div>
                    </div>
                    <div class="col-3">
                        <button class="btn btn-sm btn-info" type="button" @click="updatePassword" :disabled="isSaving">
                            Update
                        </button>
                    </div>
                </div>
            </b-form-group>
        </div>
    </b-modal>
</template>

<script>
import { User, Organization } from '@/api';
import { SET_USER } from '@/store/mutation-types';
import { clone, omit } from 'ramda';

const R = { clone, omit };

export default {
    name: 'UserModal',
    props: {
        userFormData: {
            type: Object,
            default: () => null,
        },
        editOwnProfile: {
            type: Boolean,
            default: () => false,
        },
        organizationFormData: {
            type: Object,
            default: () => null,
        },
        title: {
            type: String,
            default: () => '',
        },
    },
    data() {
        return {
            organizations: [],
            password: null,
            isSaving: false,
        };
    },
    async created() {
        if (this.editOwnProfile) {
            this.clearPassword();
        } else {
            const { data } = await Organization.all();
            this.organizations = data;
        }
    },
    methods: {
        async validateData(event) {
            event.preventDefault();
            const success = await this.$validator.validateAll();
            if (success) {
                this.updateUser();
            }
        },
        async updateUser() {
            try {
                const payload = R.omit(['userRoles'], R.clone(this.userFormData));
                const { data: user } = await User.update(payload);
                if (this.editOwnProfile) {
                    this.$store.commit(SET_USER, { user });
                    this.$toastr.s('Profile updated!', 'Success');
                    this.$bvModal.hide('editProfile');
                } else {
                    this.$toastr.s('User updated!', 'Success');
                    this.$bvModal.hide('editUser');
                }
            } catch (e) {
                this.$toastr.e('An error occured', 'Error');
            }
        },
        clearPassword() {
            this.password = {
                old_password: '',
                new_password: '',
                verify_password: '',
            };
            this.$validator.reset('passwordForm');
        },
        async updatePassword() {
            const result = await this.$validator.validateAll('passwordForm');
            if (result) {
                this.isSaving = true;
                const passData = R.omit(['verify_password'], R.clone(this.password));
                User.changePassword(passData)
                    .then(() => {
                        this.isSaving = false;
                        this.clearPassword();
                        this.$toastr.s('Password updated successfuly');
                    })
                    .catch((err) => {
                        if (err.response) {
                            this.$toastr.e(err.response.data);
                        } else {
                            this.$toastr.e('Error updating password');
                        }
                        this.isSaving = false;
                    });
            }
        },
    },
};
</script>
