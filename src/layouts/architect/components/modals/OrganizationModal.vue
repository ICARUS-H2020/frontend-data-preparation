<template>
    <div id="orgmodal">
        <b-modal
            id="editOrganization"
            variant="primary"
            size="lg"
            header-bg-variant="primary"
            header-text-variant="light"
            title="Edit organization"
            @ok="validateData"
        >
            <div class="row">
                <div class="position-relative form-group col-sm-6">
                    <label for="legalname">Legal name</label>
                    <input
                        name="legalname"
                        placeholder="Enter legal name"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.has('legalname') }"
                        disabled
                        v-model="organizationFormData.legalname"
                        v-validate="'required'"
                        required
                    />
                    <div class="invalid-feedback" v-if="errors.has('legalname')">
                        {{ errors.first('legalname') }}
                    </div>
                </div>
                <div class="position-relative form-group col-sm-6">
                    <label for="businessname">Business name</label>
                    <input
                        name="businessname"
                        placeholder="Enter business name"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.has('businessname') }"
                        v-model="organizationFormData.businessname"
                        disabled
                        v-validate="'required'"
                        required
                    />
                    <div class="invalid-feedback" v-if="errors.has('businessname')">
                        {{ errors.first('businessname') }}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="position-relative form-group col-sm-6">
                    <label for="country">Country</label>
                    <treeselect
                        name="country"
                        placeholder="Select country"
                        :options="countries"
                        :searchable="true"
                        :clearable="false"
                        :multiple="false"
                        :disable-branch-nodes="false"
                        :class="{ 'is-invalid': errors.has('country') }"
                        :value="countries.find((country) => country.label === organizationFormData.country).id"
                        :disabled="!isAdmin"
                        v-validate="'required'"
                        required
                        @select="selectCountry"
                        v-if="organizationFormData.country"
                    />
                    <treeselect
                        name="country"
                        placeholder="Select country"
                        :options="countryOptions"
                        :searchable="true"
                        :clearable="false"
                        :multiple="false"
                        :disable-branch-nodes="false"
                        :class="{ invalid: errors.has('country') }"
                        v-model="selectedCountry"
                        :disabled="!isAdmin"
                        v-validate="'required'"
                        required
                        @select="selectCountry"
                        v-else
                    />
                    <div class="invalid-feedback" v-if="errors.has('country')">
                        {{ errors.first('country') }}
                    </div>
                </div>
                <div class="position-relative form-group col-sm-6">
                    <label for="city">City</label>
                    <input
                        name="city"
                        placeholder="Enter city"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.has('city') }"
                        v-model="organizationFormData.city"
                        v-validate="'required'"
                        required
                    />
                    <div class="invalid-feedback" v-if="errors.has('city')">
                        {{ errors.first('city') }}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="position-relative form-group col-sm-6">
                    <label for="address">Address</label>
                    <input
                        name="address"
                        placeholder="Enter address"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.has('address') }"
                        v-model="organizationFormData.address"
                        v-validate="'required'"
                        required
                    />
                    <div class="invalid-feedback" v-if="errors.has('address')">
                        {{ errors.first('address') }}
                    </div>
                </div>
                <div class="position-relative form-group col-sm-6">
                    <label for="postalcode">Postal Code</label>
                    <input
                        name="postalcode"
                        placeholder="Enter postal code"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.has('postalcode') }"
                        v-model="organizationFormData.postalcode"
                        v-validate="'required'"
                        required
                    />
                    <div class="invalid-feedback" v-if="errors.has('postalcode')">
                        {{ errors.first('postalcode') }}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="position-relative form-group col-sm-6">
                    <label for="websiteurl">Website</label>
                    <input
                        name="websiteurl"
                        placeholder="Enter website"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.has('websiteurl') }"
                        v-model="organizationFormData.websiteurl"
                        v-validate="'required'"
                        required
                    />
                    <div class="invalid-feedback" v-if="errors.has('websiteurl')">
                        {{ errors.first('websiteurl') }}
                    </div>
                </div>
                <div class="position-relative form-group col-sm-6">
                    <label for="type">Type</label>
                    <treeselect
                        name="type"
                        placeholder="Select type"
                        :options="typeOptions"
                        :searchable="true"
                        :clearable="false"
                        :multiple="false"
                        :disable-branch-nodes="false"
                        :class="{ invalid: errors.has('type') }"
                        :disabled="!isAdmin"
                        v-model="organizationFormData.type"
                        v-validate="'required'"
                        required
                    />
                    <div class="invalid-feedback" v-if="errors.has('type')">
                        {{ errors.first('type') }}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="position-relative form-group col-sm-12">
                    <label for="description">Description</label>
                    <textarea
                        name="description"
                        placeholder="Enter description"
                        rows="4"
                        class="form-control"
                        v-model="organizationFormData.description"
                    />
                </div>
            </div>
            <div v-if="isAdmin && !organizationFormData.verified">
                <hr />
                <div class="row">
                    <div class="col-md-4">
                        <label for="decisionRadios"><strong>Verify Organization</strong></label>
                        <div class="form-group">
                            <div class="form-check">
                                <input
                                    class="mr-1"
                                    type="radio"
                                    name="decisionRadios"
                                    id="accept"
                                    value="accept"
                                    v-model="selectedRadio"
                                />
                                <label class="form-check-label" for="accept">
                                    &nbsp;Accept
                                </label>
                            </div>
                            <div class="form-check">
                                <input
                                    class="mr-1"
                                    type="radio"
                                    name="decisionRadios"
                                    id="requestMoreInfo"
                                    value="requestMoreInfo"
                                    v-model="selectedRadio"
                                />
                                <label class="form-check-label" for="requestMoreInfo">
                                    &nbsp;Request More Information
                                </label>
                            </div>
                            <div class="form-check">
                                <input
                                    class="mr-1"
                                    type="radio"
                                    name="decisionRadios"
                                    id="reject"
                                    value="reject"
                                    v-model="selectedRadio"
                                />
                                <label class="form-check-label" for="reject">
                                    &nbsp;Reject
                                </label>
                            </div>
                            <br />
                        </div>
                        <button
                            :disabled="!selectedRadio"
                            type="button"
                            class="btn btn-primary ml-4"
                            @click="verifyOrganization"
                        >
                            Submit
                        </button>
                    </div>
                    <div class="col-md-8" v-if="selectedRadio != null && selectedRadio != 'accept'">
                        <label for="comments">Comments</label>
                        <textarea
                            name="comments"
                            placeholder="Enter comments"
                            rows="4"
                            class="form-control"
                            :class="{ 'is-invalid': errors.has('verifyForm.comments') }"
                            data-vv-scope="verifyForm"
                            v-model="reason"
                            v-validate="'required'"
                            required
                        />
                        <div class="invalid-feedback" v-if="errors.has('verifyForm.comments')">
                            {{ errors.first('verifyForm.comments') }}
                        </div>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { omit, clone, prop, sortBy } from 'ramda';
import { Organization } from '@/api';
import datasetOptions from '@/config/dataset.json';
import typeOptions from '@/config/organization-types.json';
import Treeselect from '@riophae/vue-treeselect';

const R = { omit, clone, prop, sortBy };

export default {
    name: 'OrganizationModal',
    components: {
        Treeselect,
    },
    props: {
        organizationFormData: {
            type: Object,
            default: () => null,
        },
    },
    data() {
        return {
            countryOptions: datasetOptions.countryOptions,
            countries: [],
            typeOptions,
            selectedRadio: null,
            selectedCountry: null,
            reason: null,
        };
    },
    computed: {
        ...mapGetters(['isAdmin']),
    },
    created() {
        this.countryOptions[0].children.forEach((continent) => {
            this.countries = R.sortBy(
                R.prop('label'),
                this.countries.concat(continent.children.map((country) => R.omit(['children'], country))),
            );
        });
        this.countries[0] = R.omit(['children'], R.clone(this.countryOptions[0]));
    },
    methods: {
        async validateData(event) {
            event.preventDefault();
            const success = await this.$validator.validateAll();
            if (success) {
                this.updateOrganization();
            }
        },
        async updateOrganization() {
            try {
                if (this.selectedCountry) {
                    this.organizationFormData.country = this.countries.find(
                        (country) => country.id === this.selectedCountry,
                    ).label;
                }
                const payload = R.omit(['manager'], this.organizationFormData);
                await Organization.updateOrganization(this.organizationFormData.id, payload);
                this.$emit('updateOrganization');
                this.selectedCountry = null;
                this.$toastr.s('Organization updated!', 'Success');
                this.$bvModal.hide('editOrganization');
            } catch (e) {
                this.$toastr.e('An error occured', 'Error');
            }
        },
        async verifyOrganization() {
            if (this.selectedRadio === 'accept') {
                try {
                    await Organization.verify(this.organizationFormData.id);
                    this.$emit('updateOrganization');
                    this.selectedRadio = null;
                    this.$toastr.s('Organization verified!', 'Success');
                    this.$bvModal.hide('editOrganization');
                } catch (e) {
                    this.$toastr.e('An error occured', 'Error');
                }
            }
            if (this.selectedRadio === 'requestMoreInfo') {
                this.$validator.validateAll('verifyForm').then(async (result) => {
                    if (result) {
                        try {
                            const payload = { reason: this.reason };
                            await Organization.askForMoreInfo(this.organizationFormData.id, payload);
                            this.$emit('updateOrganization');
                            this.selectedRadio = null;
                            this.reason = null;
                            this.$toastr.s('Requested more information!', 'Success');
                            this.$bvModal.hide('editOrganization');
                        } catch (e) {
                            this.$toastr.e('An error occured', 'Error');
                        }
                    }
                });
            }
            if (this.selectedRadio === 'reject') {
                this.$validator.validateAll('verifyForm').then(async (result) => {
                    if (result) {
                        try {
                            const payload = { reason: this.reason };
                            await Organization.reject(this.organizationFormData.id, payload);
                            this.$emit('updateOrganization');
                            this.selectedRadio = null;
                            this.reason = null;
                            this.$toastr.s('Organization rejected!', 'Success');
                            this.$bvModal.hide('editOrganization');
                        } catch (e) {
                            this.$toastr.e('An error occured', 'Error');
                        }
                    }
                });
            }
        },
        selectCountry(node) {
            this.selectedCountry = node.id;
        },
    },
};
</script>

<style lang="scss">
.orgmodal {
    .vue-treeselect__control {
        height: 38px;
    }

    .vue-treeselect__placeholder,
    .vue-treeselect__single-value {
        line-height: 36px;
    }

    .vue-treeselect__placeholder {
        color: #8d8f90;
    }
    .invalid-feedback {
        display: block;
    }
    .invalid {
        border: 1px solid red;
        border-radius: 5px;
    }
}
</style>
