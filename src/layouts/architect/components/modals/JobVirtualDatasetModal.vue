<template>
    <b-modal
        :id="id"
        variant="primary"
        size="lg"
        header-bg-variant="primary"
        header-text-variant="light"
        :title="title"
    >
        <div class="position-relative form-group" v-if="jobOrDataset">
            <label for="name">Name</label>
            <input
                name="name"
                :placeholder="namePlaceholder"
                type="text"
                class="form-control"
                v-model="jobOrDataset.name"
                v-validate="'required|max:100'"
                :class="{ 'is-invalid': errors.has('name') }"
            />
            <div class="invalid-feedback" v-if="errors.has('name')">
                {{ errors.first('name') }}
            </div>
        </div>
        <div class="position-relative form-group" v-if="jobOrDataset">
            <label for="description">Description</label>
            <textarea
                name="description"
                :placeholder="descriptionPlaceholder"
                rows="4"
                class="form-control"
                v-model="jobOrDataset.description"
                v-validate="'max:200'"
                :class="{ 'is-invalid': errors.has('description') }"
            />
            <div class="invalid-feedback" v-if="errors.has('description')">
                {{ errors.first('description') }}
            </div>
        </div>
        <div class="row">
            <div class="position-relative form-group col-sm-6" v-if="jobOrDataset && type === 'dataCheckin'">
                <label for="accessType">Access Type</label>
                <br />
                <b-dropdown
                    name="accessType"
                    :text="
                        jobOrDataset && (jobOrDataset.id || jobOrDataset.accessType)
                            ? existingAccessTypeText
                            : accessTypeText
                    "
                    variant="outline-primary"
                    :disabled="okTitle !== 'Create'"
                    v-model="jobOrDataset.accessType"
                    v-validate="'required'"
                    :class="{ 'is-invalid': errors.has('accessType') }"
                >
                    <b-dropdown-item
                        v-for="option in accessTypeOptions"
                        :key="option.value"
                        :value="option.value"
                        @click="selectAccessType(option)"
                    >
                        {{ option.label }}
                    </b-dropdown-item>
                </b-dropdown>
                <div v-if="errors.has('accessType')" style="font-size: 80%; color: #dc3545; margin-top: 0.25rem;">
                    {{ errors.first('accessType') }}
                </div>
            </div>

            <div class="position-relative form-group col-sm-6" v-if="type === 'dataCheckin'">
                <label for="dataCheckinMethod">Data Check-in Method</label>

                <b-form-radio-group
                    v-if="jobOrDataset && jobOrDataset.id"
                    v-model="existingDCJMethod"
                    :options="dataCheckinMethods"
                    v-validate="'required'"
                    :disabled="okTitle !== 'Create'"
                    name="dataCheckinMethod"
                ></b-form-radio-group>

                <b-form-radio-group
                    v-else
                    v-model="selectedDataCheckinMethod"
                    :options="dataCheckinMethods"
                    v-validate="'required'"
                    @input="changeDataCheckinMethod"
                    :disabled="okTitle !== 'Create'"
                    name="dataCheckinMethod"
                />

                <div class="invalid-feedback" v-if="errors.has('dataCheckinMethod')">
                    {{ errors.first('dataCheckinMethod') }}
                </div>
            </div>
        </div>
        <template slot="modal-footer">
            <button type="button" @click="cancel" class="btn btn-wide btn-secondary btn-sm btn-shadow float-right">
                Cancel
            </button>
            <button
                type="button"
                @click="$emit('ok', $event)"
                class="btn btn-wide btn-primary btn-sm btn-shadow text-white float-right"
                v-if="!isSaving"
            >
                {{ okTitle }}
            </button>
            <button
                type="button"
                class="btn btn-primary btn-sm btn-shadow text-white float-right"
                v-if="isSaving"
                disabled
            >
                <b-spinner small></b-spinner>
                &nbsp;
                <span v-if="okTitle === 'Create'">
                    Creating
                </span>
                <span v-else-if="okTitle === 'Update'">
                    Updating
                </span>
                <span v-else-if="okTitle === 'Clone'">
                    Cloning
                </span>
            </button>
        </template>
    </b-modal>
</template>

<script>
export default {
    name: 'JobVirtualDatasetModal',
    inject: ['$validator'],
    props: {
        id: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        okTitle: {
            type: String,
            required: true,
        },
        namePlaceholder: {
            type: String,
            required: true,
        },
        descriptionPlaceholder: {
            type: String,
            required: true,
        },
        accessTypeOptions: {
            type: Array,
            default: () => {
                return [];
            },
        },
        jobOrDataset: {
            type: Object,
            default: null,
        },
        isSaving: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            default: 'dataCheckin',
        },
    },
    data() {
        return {
            accessTypeText: 'Choose access type',
            selectedDataCheckinMethod: 'File',
            dataCheckinMethods: ['File', 'API'],
        };
    },
    computed: {
        existingAccessTypeText() {
            if (this.jobOrDataset && (this.jobOrDataset.id || this.jobOrDataset.accessType)) {
                return this.accessTypeOptions.filter((aType) => aType.value === this.jobOrDataset.accessType)[0].label;
            }
            return '';
        },
        existingDCJMethod() {
            return this.jobOrDataset && this.jobOrDataset.id && this.jobOrDataset.apiImport ? 'API' : 'File';
        },
    },
    methods: {
        selectAccessType(option) {
            this.accessTypeText = option.label;
            this.jobOrDataset.accessType = option.value;
        },
        changeDataCheckinMethod() {
            if (this.selectedDataCheckinMethod === 'API') {
                this.jobOrDataset.apiImport = true;
                this.jobOrDataset.apiDetails = {
                    username: null,
                    password: null,
                    userId: null,
                    jobId: null,
                    extraHeaders: {},
                    endpoint: '',
                    httpMethod: 'GET',
                    apiResponseType: 'JSON',
                    apiAuthenticationType: 'NONE',
                    requestBody: null,
                    bearerToken: null,
                };
            } else {
                this.jobOrDataset.apiDetails = {};
                this.jobOrDataset.apiImport = false;
            }
        },
        cancel() {
            this.selectedDataCheckinMethod = 'File';
            this.accessTypeText = 'Choose access type';
            this.$bvModal.hide(this.id);
        },
    },
};
</script>
