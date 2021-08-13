<template>
    <div class="contract-template">
        <page-title
            :title="title"
            :description="description"
            :icon="'lnr-pencil icon-gradient bg-sunny-morning'"
            v-slot:actions
        >
            <button
                type="button"
                class="btn-shadow d-inline-flex align-items-center btn btn-warning text-white"
                @click="save()"
                :disabled="!contractTemplate.name"
            >
                Save
            </button>
            &nbsp;
            <button
                type="button"
                class="btn-shadow d-inline-flex align-items-center btn btn-light"
                @click="$router.push({ name: 'organization-profile-edit' })"
            >
                Cancel
            </button>
        </page-title>

        <div class="row mb-4">
            <div class="col-12">
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="card card-border">
                            <div class="card-header">Template Details</div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-1 pt-2">
                                        <strong>Name:</strong>
                                    </div>
                                    <div class="col-5">
                                        <div class="input-group">
                                            <input type="text" class="form-control" v-model="contractTemplate.name" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="card card-border">
                            <div class="card-header">Contract Terms</div>
                            <div class="card-body">
                                <vue-editor v-model="contractTemplate.terms" :editor-toolbar="toolbar" id="terms" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-editor';
import { PageTitle } from '@/components';
import toolbar from '@/config/toolbar';
import { Contract } from '@/api';

export default {
    name: 'ContractTemplate',
    components: { PageTitle, VueEditor },
    props: {
        id: {
            type: [String, Number],
            default: null,
        },
    },
    data() {
        return {
            title: '',
            description: '',
            toolbar,
            contractTemplate: {
                name: '',
                terms: '',
            },
        };
    },
    async created() {
        if (this.id) {
            // Edit contract template
            this.title = 'Edit Contract Template';
            this.description = 'Edit name and terms of contract template';
            const { data } = await Contract.getTemplate(this.id);
            this.contractTemplate = data;
        } else {
            // Create contract template
            this.title = 'Create Contract Template';
            this.description = 'Add name and terms of contract template';
        }
    },
    methods: {
        async save() {
            if (this.id) {
                // Edit contract template
                try {
                    await Contract.editTemplate(this.id, this.contractTemplate);
                    this.$toastr.s('Contract template updated!', 'Success');
                    this.$router.push({ name: 'organization-profile-edit' });
                } catch (e) {
                    this.$toastr.e('An error occured', 'Error');
                }
            } else {
                // Create contract template
                try {
                    await Contract.createTemplate(this.contractTemplate);
                    this.$toastr.s('Contract Template created!', 'Success');
                    this.$router.push({ name: 'organization-profile-edit' });
                } catch (e) {
                    this.$toastr.e('An error occured', 'Error');
                }
            }
        },
    },
};
</script>

<style lang="scss">
.contract-template {
    .quillWrapper .ql-snow.ql-toolbar {
        background-color: var(--light);
    }

    #terms {
        height: 38vh;
    }

    h6.label {
        font-size: 0.9rem;
        font-weight: 600;
    }
    .input-group-text {
        font-size: 0.8rem;
        font-weight: 500;
        background-color: var(--light);
    }

    .input-group-append .btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .ql-align-justify {
        margin-bottom: 0;
    }

    .ql-align-center {
        text-align: center;
    }
}
</style>
