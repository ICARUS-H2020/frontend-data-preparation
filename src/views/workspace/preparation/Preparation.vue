<template>
    <div class="datasets">
        <div class="action-bar-wrapper">
            <div class="d-flex flex-wrap justify-content-between">
                <div class="col-6 col-md-5 p-0 input-group">
                    <div class="input-group-prepend my-1">
                        <span class="input-group-text">
                            <font-awesome-icon icon="search" />
                        </span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search for virtual dataset..."
                        class="form-control search-field my-1"
                        v-model="query"
                    />
                </div>
                <div>
                    <b-button
                        class="btn-hover-shine btn-shadow btn-transition btn-warning text-white my-1"
                        variant="warning"
                        size="sm"
                        @click="createDataset"
                        v-b-tooltip="'Create new Virtual Dataset'"
                        v-if="!isLoading"
                    >
                        <font-awesome-icon icon="plus" class="mr-2" />
                        Create Virtual Dataset
                    </b-button>
                    <loading-button variant="warning" :loading="isLoading" />
                </div>
            </div>
        </div>

        <div class="alert alert-info mt-3" role="alert" v-if="!isLoading && datasets.length == 0">
            <font-awesome-icon icon="info-circle" />
            <span class="ml-3">No Virtual Datasets found!</span>
        </div>
        <div class="main-card card card-border mb-3" v-else-if="!isLoading">
            <div class="table-responsive">
                <table class="align-middle text-truncate mb-0 table table-hover fixed">
                    <thead>
                        <tr>
                            <th class="text-center" width="5%">#</th>
                            <th class="text-left" width="45%">Name</th>
                            <th class="text-center" width="15%">Status</th>
                            <th class="text-left" width="20%">Created By</th>
                            <th class="text-left" width="15%">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(dataset, idx) in sortedDatasets" :key="dataset.id">
                            <td class="text-center text-muted pl-4 pr-4" width="5%">{{ idx + 1 }}</td>
                            <td class="text-left" width="45%">
                                <router-link
                                    :to="{ name: 'workspace.preparation.editor', params: { id: dataset.id } }"
                                    class="router-link-overflow"
                                >
                                    <strong>{{ dataset.name }}</strong>
                                    <br />
                                    <em class="text-muted">{{ dataset.description }}</em>
                                </router-link>
                            </td>
                            <td class="text-center" width="15%">
                                <div class="badge badge-success" v-if="dataset.completed">Completed</div>
                                <div class="badge" v-else>Pending</div>
                            </td>
                            <td class="text-left overflow" v-if="dataset.user" width="20%">
                                <vue-avatar
                                    class="mr-1"
                                    :username="[dataset.user.firstname, dataset.user.lastname].join(' ')"
                                    :size="32"
                                    :custom-style="{ display: 'inline-block', opacity: 0.4 }"
                                    :lighten="200"
                                />
                                <!-- <img
                                    :src="dataset.user.image"
                                    class="avatar-sm rounded-circle"
                                    v-if="dataset.user.image"
                                />
                                <img src="/img/user.png" class="avatar-sm rounded-circle" v-else /> -->
                                {{ dataset.user.firstname }} {{ dataset.user.lastname }}
                            </td>
                            <td class="text-left" width="15%">
                                <b-button-group>
                                    <b-button
                                        variant="light"
                                        size="sm"
                                        @click="editDataset(dataset)"
                                        v-b-tooltip="'Edit'"
                                    >
                                        <font-awesome-icon icon="edit" />
                                    </b-button>
                                    <b-button
                                        variant="light"
                                        size="sm"
                                        @click="visualizeDataset(dataset)"
                                        v-b-tooltip="'Visualize'"
                                        v-if="dataset.completed"
                                    >
                                        <font-awesome-icon icon="chart-area" />
                                    </b-button>
                                    <b-button
                                        variant="light"
                                        size="sm"
                                        @click="cloneDataset(dataset)"
                                        v-b-tooltip="'Clone'"
                                    >
                                        <font-awesome-icon icon="clone" />
                                    </b-button>
                                    <b-button
                                        variant="danger"
                                        size="sm"
                                        @click="deleteDataset(dataset)"
                                        v-b-tooltip="'Delete'"
                                    >
                                        <font-awesome-icon icon="trash" />
                                    </b-button>
                                </b-button-group>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <job-virtual-dataset-modal
            id="createDataset"
            :title="createDatasetModalTitle"
            :ok-title="createDatasetModalOkButtonTitle"
            name-placeholder="Enter virtual dataset name"
            description-placeholder="Enter virtual dataset description"
            :job-or-dataset="newDataset"
            :is-saving="isSaving"
            type="virtualDataset"
            @ok="createOrUpdateDataset"
        />

        <job-virtual-dataset-modal
            id="cloneDataset"
            title="Clone dataset"
            ok-title="Clone"
            name-placeholder="Enter virtual dataset name"
            description-placeholder="Enter virtual dataset description"
            :job-or-dataset="newClonedDataset"
            :is-saving="isSaving"
            type="virtualDataset"
            @ok="startCloningDataset"
        />
    </div>
</template>

<script>
import * as R from 'ramda';
import { mapState } from 'vuex';
import Fuse from 'fuse.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faInfoCircle,
    faPlus,
    faEdit,
    faTrash,
    faSearch,
    faChartArea,
    faClone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { VirtualDataset, VirtualDatasetStep } from '@/api';
import VueAvatar from 'vue-avatar';
import { LoadingButton } from '@/components';
import JobVirtualDatasetModal from '@/layouts/architect/components/modals/JobVirtualDatasetModal.vue';

library.add(faInfoCircle, faPlus, faEdit, faTrash, faSearch, faChartArea, faClone);

const byDate = R.descend(R.prop('created'));

export default {
    name: 'DataPreparation',
    components: { FontAwesomeIcon, VueAvatar, LoadingButton, JobVirtualDatasetModal },
    provide() {
        return {
            $validator: this.$validator,
        };
    },
    data: () => ({
        createDatasetModalTitle: '',
        createDatasetModalOkButtonTitle: '',
        newDataset: null,
        newClonedDataset: null,
        isSaving: false,
        isLoading: false,
        query: '',
        datasets: [],
        searchOptions: {
            shouldSort: false,
            threshold: 0.4,
            location: 0,
            distance: 1000,
            maxPatternLength: 32,
            minMatchCharLength: 3,
            keys: [
                { name: 'name', weight: 0.8 },
                { name: 'description', weight: 0.3 },
            ],
        },
        fuse: null,
    }),
    computed: {
        ...mapState(['user', 'organization']),
        filteredDatasets() {
            if (this.query.trim() === '') {
                return this.datasets;
            }

            this.currentPage = 1; // eslint-disable-line
            return this.fuse.search(this.query.trim());
        },
        sortedDatasets() {
            return R.sort(byDate, this.filteredDatasets);
        },
    },
    async created() {
        this.isLoading = true;
        const { data } = await VirtualDataset.all();
        this.datasets = R.sortWith([R.descend(R.prop('id'))], data);
        this.fuse = new Fuse(this.datasets, this.searchOptions);
        this.isLoading = false;
    },
    methods: {
        async createOrUpdateDataset(event) {
            event.preventDefault();

            this.$validator.validateAll().then(async (success) => {
                if (success) {
                    try {
                        this.isSaving = true;
                        if (this.newDataset.id) {
                            const { data } = await VirtualDataset.update(this.newDataset.id, this.newDataset);
                            const idx = this.datasets.findIndex((obj) => obj.id === data.id);
                            if (~idx) {
                                this.datasets.splice(idx, 1, data);
                            }
                        } else {
                            const { data } = await VirtualDataset.create(this.newDataset);
                            this.datasets.unshift(data);
                        }
                        this.$nextTick(() => {
                            this.$bvModal.hide('createDataset');
                            this.newDataset = {
                                name: '',
                                description: '',
                                input_dataset: null,
                                user_id: this.user.id,
                                columns: [],
                                completed: false,
                            };
                        });
                        this.isSaving = false;
                    } catch (error) {
                        this.isSaving = false;
                        this.$nextTick(() => {
                            this.$bvModal.hide('createDataset');
                            this.newDataset = {
                                name: '',
                                description: '',
                                input_dataset: null,
                                user_id: this.user.id,
                                columns: [],
                                completed: false,
                            };
                        });
                        if (error.response && error.response.data && error.response.data.error) {
                            this.$toastr.e(error.response.data.error, 'Error');
                        } else {
                            this.$toastr.e('An error occured', 'Error');
                        }
                    }
                }
            });
        },
        createDataset() {
            this.createDatasetModalTitle = 'Create new virtual dataset';
            this.createDatasetModalOkButtonTitle = 'Create';
            this.newDataset = {
                name: '',
                description: '',
                input_dataset: null,
                user_id: this.user.id,
                columns: [],
                completed: false,
            };
            this.$bvModal.show('createDataset');
        },
        deleteDataset(dataset) {
            this.$swal({
                title: 'Are you sure?',
                text: 'This action cannot be undone',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d92550',
                confirmButtonText: 'Delete',
            }).then(async (result) => {
                if (result.value) {
                    await VirtualDataset.delete(dataset.id);
                    const idx = this.datasets.indexOf(dataset);
                    if (~idx) {
                        this.datasets.splice(idx, 1);
                    }
                    this.$toastr.s('Virtual dataset deleted successfuly!');
                }
            });
        },
        editDataset(dataset) {
            this.createDatasetModalTitle = 'Edit virtual dataset';
            this.createDatasetModalOkButtonTitle = 'Update';
            this.newDataset = R.clone(dataset);
            this.$bvModal.show('createDataset');
        },
        visualizeDataset(dataset) {
            const dbName = this.organization.businessname
                .replace(/\s/g, '')
                .replace(/[^a-zA-Z0-9]/g, '_')
                .toLowerCase();
            this.$router.push({
                name: 'workspace.visualize',
                params: {
                    dbName,
                    datasetId: dataset.id,
                    datasetType: 'virtual_dataset',
                },
            });
        },
        cloneDataset(dataset) {
            this.newClonedDataset = {
                name: '',
                description: '',
                input_dataset: dataset.input_dataset,
                user_id: this.user.id,
                columns: dataset.columns,
                completed: false,
                virtualDatasetSteps: dataset.virtualDatasetSteps,
            };
            this.$bvModal.show('cloneDataset');
        },
        async startCloningDataset(event) {
            event.preventDefault();

            this.$validator.validateAll().then(async (success) => {
                if (success) {
                    try {
                        this.isSaving = true;
                        const { data } = await VirtualDataset.create(this.newClonedDataset);
                        data.virtualDatasetSteps = this.newClonedDataset.virtualDatasetSteps;

                        await data.virtualDatasetSteps.reduce(async (promise, vdStep) => {
                            await promise;
                            vdStep.vd_id = data.id;
                            vdStep.executed = false;
                            vdStep.applied_rules = null;
                            const { data: newClonedStep } = await VirtualDatasetStep.create(vdStep);
                            const processStepPayload = {
                                id: newClonedStep.id,
                                organization: this.organization.businessname,
                            };
                            await VirtualDatasetStep.processStep(processStepPayload);
                        }, Promise.resolve());
                        this.datasets.unshift(data);
                        this.$nextTick(() => {
                            this.$bvModal.hide('cloneDataset');
                            this.newClonedDataset = {
                                name: '',
                                description: '',
                                input_dataset: '',
                                user_id: this.user.id,
                                columns: [],
                                completed: false,
                                virtualDatasetSteps: [],
                            };
                        });
                        this.isSaving = false;
                        this.$toastr.s('Virtual dataset cloned successfully!', 'Success');
                    } catch (error) {
                        this.isSaving = false;
                        this.$nextTick(() => {
                            this.$bvModal.hide('cloneDataset');
                            this.newClonedDataset = {
                                name: '',
                                description: '',
                                input_dataset: '',
                                user_id: this.user.id,
                                columns: [],
                                completed: false,
                                virtualDatasetSteps: [],
                            };
                        });
                        if (error.response && error.response.data && error.response.data.error) {
                            this.$toastr.e(error.response.data.error, 'Error');
                        } else {
                            this.$toastr.e('Processing service unavailable!', 'Error');
                        }
                    }
                }
            });
        },
    },
};
</script>

<style lang="scss">
.datasets {
    .scroll-area-lg {
        height: 69vh;
    }

    table.fixed {
        table-layout: fixed;
    }
    table.fixed td.overflow {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 0;
    }

    .router-link-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    td > a {
        display: block;
        text-decoration: none;
    }
    .input-group-text {
        background-color: var(--light);
    }
    .table th {
        border-top: 0;
    }
    .vue-avatar--wrapper {
        display: inline-block;
    }
}
</style>
