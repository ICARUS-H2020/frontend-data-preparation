<template>
    <div class="dataset-editor row">
        <div class="col-3">
            <div class="card mb-4">
                <div class="card-header">
                    <div>Summary</div>
                </div>
                <div class="card-body">
                    <vue-perfect-scrollbar style="height: 700px;">
                        <div
                            class="vertical-without-time vertical-timeline vertical-timeline--animate vertical-timeline--one-column"
                        >
                            <div
                                class="vertical-timeline-item vertical-timeline-element"
                                :class="{ 'opacity-4': !initialized }"
                            >
                                <div>
                                    <span class="vertical-timeline-element-icon bounce-in">
                                        <i class="badge badge-dot badge-dot-xl badge-primary"></i>
                                    </span>
                                    <div class="vertical-timeline-element-content bounce-in">
                                        <h4 class="timeline-title">Step 0: Load Dataset</h4>
                                        <p v-if="initialized">&bull; {{ initialDataset.name }}</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="vertical-itemline-item vertical-timeline-element"
                                v-for="step in steps"
                                :key="step.id"
                            >
                                <div>
                                    <span class="vertical-timeline-element-icon bounce-in">
                                        <i class="badge badge-dot badge-dot-xl" :class="dotColor(step)" />
                                    </span>
                                    <div class="vertical-timeline-element-content">
                                        <h4 class="timeline-title">Step {{ step.order }}: {{ stepName(step) }}</h4>
                                        <p></p>
                                    </div>
                                </div>
                            </div>
                            <div class="vertical-itemline-item vertical-timeline-element opacity-4" v-if="activeStep">
                                <div>
                                    <span class="vertical-timeline-element-icon bounce-in">
                                        <i class="badge badge-dot badge-dot-xl" :class="dotColor(activeStep)" />
                                    </span>
                                    <div class="vertical-timeline-element-content">
                                        <h4 class="timeline-title">
                                            Step {{ activeStep.order }}: {{ stepName(activeStep) }}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="vertical-timeline-item vertical-timeline-element"
                                :class="{ 'opacity-4': !initialized }"
                                v-if="initialized && virtualDataset.completed"
                            >
                                <div>
                                    <span class="vertical-timeline-element-icon bounce-in">
                                        <i class="badge badge-dot badge-dot-xl badge-primary"></i>
                                    </span>
                                    <div class="vertical-timeline-element-content bounce-in">
                                        <h4 class="timeline-title">Virtual Dataset Finalized</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </vue-perfect-scrollbar>
                </div>
            </div>
        </div>
        <div class="col-9">
            <div class="card mb-4">
                <div class="card-header card-header-tab">
                    <div>Data Preparation Rules</div>
                    <div class="btn-actions-pane-right" v-if="initialized && !virtualDataset.completed">
                        <button
                            type="button"
                            class="btn btn-warning btn-sm btn-shadow text-white float-right mr-1"
                            @click="finalize()"
                            v-if="!finalizeLoading"
                            :disabled="initialDataset === null || steps.length === 0 || activeStep !== null"
                        >
                            Finalize
                        </button>
                        <button
                            type="button"
                            class="btn btn-warning btn-sm btn-shadow text-white float-right mr-1"
                            v-if="finalizeLoading"
                            disabled
                        >
                            <b-spinner small></b-spinner>
                            &nbsp;Loading...
                        </button>
                        <b-dropdown
                            class="mr-2"
                            text="New Step"
                            size="sm"
                            variant="primary"
                            offset="-206"
                            :disabled="activeStep !== null"
                        >
                            <b-dropdown-item @click="addStep('add')">Create new column(s)</b-dropdown-item>
                            <b-dropdown-item @click="addStep('drop')">Drop rows or columns</b-dropdown-item>
                            <b-dropdown-item @click="addStep('rename')">Rename column(s)</b-dropdown-item>
                            <b-dropdown-item @click="addStep('merge')">Merge with another dataset</b-dropdown-item>
                            <b-dropdown-item @click="addStep('filter_and')">
                                Apply Conditions (with AND operator)
                            </b-dropdown-item>
                            <b-dropdown-item @click="addStep('filter_or')">
                                Apply Conditions (with OR operator)
                            </b-dropdown-item>
                            <b-dropdown-item @click="addStep('aggregate')">Compute aggregations</b-dropdown-item>
                            <b-dropdown-item @click="addStep('fillna')">Fill null values</b-dropdown-item>
                            <b-dropdown-item @click="addStep('split_column')">Split columns</b-dropdown-item>
                            <b-dropdown-item @click="addStep('enrich')">Enrich content</b-dropdown-item>
                        </b-dropdown>
                    </div>
                    <div class="btn-actions-pane-right" v-if="initialized && virtualDataset.completed">
                        <button
                            type="button"
                            class="btn btn-info btn-sm btn-shadow text-white mr-2"
                            v-b-tooltip.hover="
                                'Download the virtual dataset locally. Once you select to download a virtual dataset, the results are being prepared. When they are ready, you will receive a notification.'
                            "
                            @click="downloadVirtualDataset(virtualDataset.id)"
                            v-if="canDownload && canDownload.downloadAllowed && !downloading"
                        >
                            Download
                        </button>
                        <button
                            type="button"
                            class="btn btn-warning btn-sm btn-shadow text-white mr-2"
                            @click="visualizeDataset"
                        >
                            Visualize
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary btn-sm btn-shadow text-white"
                            @click="$router.push({ name: 'workspace.preparation' })"
                        >
                            Back to data preparation
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-12" v-if="showInitialWarning">
                            <div class="alert alert-warning" role="alert">
                                <font-awesome-icon icon="exclamation-circle" />
                                <span class="ml-2">{{ warning }}</span>
                            </div>
                        </div>
                        <div class="col-12">
                            <strong>[0]: Load Dataset</strong>
                            <div class="alert alert-light mt-1">
                                <div class="row" v-if="datasetsAreLoaded">
                                    <div class="col-6 pl-2">
                                        <select
                                            class="form-control"
                                            @change="showWarning(initialDataset.type, initialDataset.id, 'initial')"
                                            v-model="initialDataset"
                                            v-if="!initialized"
                                        >
                                            <option :value="null" disabled>Select a dataset</option>
                                            <optgroup label="Datasets">
                                                <option
                                                    v-for="dataset in datasets"
                                                    :key="`dataset-${dataset.name}`"
                                                    :value="dataset"
                                                >
                                                    {{ dataset.name }}
                                                </option>
                                            </optgroup>
                                            <optgroup label="Virtual Datasets" v-if="virtualDatasets.length > 0">
                                                <option
                                                    v-for="dataset in virtualDatasets"
                                                    :key="`virtual-dataset-${dataset.name}`"
                                                    :value="dataset"
                                                >
                                                    {{ dataset.name }}
                                                </option>
                                            </optgroup>
                                        </select>
                                        <input
                                            type="text"
                                            class="form-control bg-white text-primary"
                                            :value="initialDataset.name"
                                            disabled
                                            v-else
                                        />
                                    </div>
                                    <div class="col-6">
                                        <button
                                            type="button"
                                            class="btn btn-warning btn-sm btn-shadow text-white float-right mt-1"
                                            @click="initialize(initialDataset)"
                                            v-if="!initialized"
                                            :disabled="initialDataset === null"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                                <div class="row justify-content-center" v-else>
                                    <div class="loading-indicator p-1">
                                        <Spinner name="wave" color="var(--primary)" no-fade-in />
                                        <h6 class="message">Please wait... Loading datasets...</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12" v-for="(step, idx) in steps" :key="step.id">
                            <div
                                v-if="
                                    step.action === 'merge' &&
                                    Object.keys(stepsWarnings).includes(step.id.toString()) &&
                                    stepsWarnings[step.id]
                                "
                            >
                                <div class="alert alert-warning" role="alert">
                                    <font-awesome-icon icon="exclamation-circle" />
                                    <span class="ml-2">{{ warning }}</span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <strong>[{{ step.order }}]: {{ stepName(step) }}</strong>
                                <span @click="showStepInfoModal(step)" class="pr-1 step-info-button">Get Info</span>
                            </div>
                            <completed-step :step="step"></completed-step>
                            <div class="text-right">
                                <button
                                    type="button"
                                    class="btn btn-wide btn-danger btn-secondary btn-sm btn-shadow text-white"
                                    @click="deleteSavedStep(step)"
                                    v-if="!virtualDataset.completed && idx === steps.length - 1 && !activeStep"
                                >
                                    Delete Last Step
                                </button>
                            </div>
                        </div>
                        <div class="col-12" v-if="activeStep && activeStep.action === 'merge' && showActiveStepWarning">
                            <div class="alert alert-warning" role="alert">
                                <font-awesome-icon icon="exclamation-circle" />
                                <span class="ml-2">{{ warning }}</span>
                            </div>
                        </div>
                        <div class="col-12" v-if="activeStep">
                            <strong>[{{ activeStep.order }}]: {{ stepName(activeStep) }}</strong>
                            <editor-step
                                :step="activeStep"
                                :loading="stepLoading"
                                :datasets="datasets"
                                :virtual-datasets="virtualDatasets"
                                :columns="availableColumns"
                                @discard="deleteStep"
                                @save="saveStep"
                                @showWarning="showWarning"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <b-modal
            id="getStepInfo"
            variant="primary"
            size="lg"
            header-bg-variant="primary"
            header-text-variant="light"
            title="Get step information"
        >
            <div class="info-modal-content">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="position-relative form-group">
                            <label for="infoFunction">Function</label>
                            <select
                                name="infoFunction"
                                class="form-control"
                                v-model="selectionRule.function"
                                @change="clearSelectionRule()"
                                v-validate="'required'"
                                :class="{ invalid: errors.has('infoFunction') && selectionRule.submitted }"
                            >
                                <option :value="null" disabled>Select function</option>
                                <option v-for="f in Object.keys(preparationStepInfoOptions)" :value="f" :key="f">
                                    {{ preparationStepInfoOptions[f].label || f }}
                                </option>
                            </select>
                            <div
                                class="form-text text-danger pl-1 pr-1"
                                v-if="errors.has('infoFunction') && selectionRule.submitted"
                            >
                                <small>This field is required.</small>
                            </div>
                        </div>
                    </div>
                    <div v-if="preparationStepInfoOptions[selectionRule.function]" class="col-sm-6">
                        <div
                            v-for="param in Object.keys(preparationStepInfoOptions[selectionRule.function].parameters)"
                            :key="param"
                        >
                            <div class="position-relative form-group">
                                <label for="infoFunctionParameters">Column</label>
                                <multiselect
                                    name="infoFunctionParameters"
                                    v-model="selectionRule.parameters[param]"
                                    :options="
                                        getColumns(
                                            selectionRule,
                                            preparationStepInfoOptions[selectionRule.function].parameters[param],
                                        )
                                    "
                                    :close-on-select="
                                        !preparationStepInfoOptions[selectionRule.function].parameters[param].facets
                                            .multiple
                                    "
                                    :multiple="
                                        preparationStepInfoOptions[selectionRule.function].parameters[param].facets
                                            .multiple
                                    "
                                    :limit="1"
                                    placeholder="Select..."
                                    v-validate="
                                        preparationStepInfoOptions[selectionRule.function].parameters[param].facets
                                            .validation
                                    "
                                    :class="{
                                        invalid: errors.has('infoFunctionParameters') && selectionRule.submitted,
                                    }"
                                >
                                    <template slot="singleLabel" slot-scope="props">
                                        <span>{{ props.option | truncate(35) }}</span>
                                    </template>
                                </multiselect>
                                <div
                                    class="form-text text-danger pl-1 pr-1"
                                    v-if="errors.has('infoFunctionParameters') && selectionRule.submitted"
                                >
                                    <small>This field is required</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="stepInfoResult">
                    <div class="col-sm-12">
                        <span>Result:</span>
                    </div>
                    <div class="col-sm-12" v-if="selectionRule.function !== 'previewResults'">
                        <div class="alert alert-secondary mt-1">
                            <vue-json-pretty :data="stepInfoResult"></vue-json-pretty>
                        </div>
                    </div>
                    <div class="col-sm-12" v-else>
                        <vue-scrolling-table
                            v-if="Array.isArray(stepInfoResult.result) && stepInfoResult.result.length > 0"
                        >
                            <template slot="thead">
                                <tr>
                                    <th class="text-center">#</th>
                                    <th
                                        v-for="col in Object.keys(stepInfoResult.result[0])"
                                        :key="col"
                                        class="text-center"
                                    >
                                        {{ col }}
                                    </th>
                                </tr>
                            </template>
                            <template slot="tbody">
                                <tr v-for="(item, idx) in stepInfoResult.result" :key="idx">
                                    <td class="text-center">
                                        <strong>{{ idx + 1 }}</strong>
                                    </td>
                                    <td
                                        v-for="col in Object.keys(stepInfoResult.result[0])"
                                        :key="`${idx}-${col}`"
                                        class="text-center"
                                    >
                                        {{ item[col] }}
                                    </td>
                                </tr>
                            </template>
                        </vue-scrolling-table>
                        <div v-else>
                            <span class="text-warning">There are no results for preview.</span>
                        </div>
                    </div>
                </div>
            </div>
            <template slot="modal-footer">
                <button
                    type="button"
                    @click="$bvModal.hide('getStepInfo')"
                    class="btn btn-wide btn-secondary btn-sm btn-shadow float-right"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    @click="getStepInfo"
                    class="btn btn-wide btn-primary btn-sm btn-shadow text-white float-right"
                    v-if="!stepInfoLoading"
                >
                    Submit
                </button>
                <button
                    type="button"
                    class="btn btn-primary btn-sm btn-shadow text-white float-right"
                    v-if="stepInfoLoading"
                    disabled
                >
                    <b-spinner small></b-spinner>
                    &nbsp;Loading...
                </button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import * as R from 'ramda';
import multiselect from 'vue-multiselect';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import VueJsonPretty from 'vue-json-pretty';
import VueScrollingTable from 'vue-scrolling-table';
import { DataAsset, VirtualDataset, VirtualDatasetStep, UsageAnalytics } from '@/api';
import { mapState } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { EditorStep, CompletedStep } from '.';
import preparationStepInfoOptions from '@/config/preparation_step_info.json';

library.add(faExclamationCircle);

export default {
    name: 'DataPreparationEditor',
    components: {
        EditorStep,
        CompletedStep,
        VuePerfectScrollbar,
        FontAwesomeIcon,
        multiselect,
        VueJsonPretty,
        VueScrollingTable,
    },
    props: {
        id: {
            type: [String, Number],
            required: true,
        },
    },
    data: () => ({
        virtualDataset: null,
        initialDataset: null,
        initialized: false,
        datasetsAreLoaded: false,
        datasets: [],
        virtualDatasets: [],
        activeStep: null,
        steps: [],
        stepLoading: false,
        finalizeLoading: false,
        stepInfoLoading: false,
        preparationStepInfoOptions,
        selectionRule: {
            function: null,
            submitted: false,
        },
        stepInfoResult: null,
        canDownload: false,
        showInitialWarning: false,
        showActiveStepWarning: false,
        stepsWarnings: {},
        warning:
            'Attention: The dataset you have selected has restricted permissions for derivative works. Please review the license of the dataset before proceeding.',
        downloading: false,
    }),
    computed: {
        ...mapState(['organization']),
        dotColor() {
            return (step) => {
                switch (step.action) {
                    case 'init':
                        return 'badge-primary';
                    case 'add':
                        return 'badge-success';
                    case 'drop':
                        return 'badge-danger';
                    case 'rename':
                        return 'badge-success';
                    case 'merge':
                        return 'badge-info';
                    case 'filter_and':
                        return 'badge-secondary';
                    case 'filter_or':
                        return 'badge-secondary';
                    case 'aggregate':
                        return 'badge-warning';
                    case 'fillna':
                        return 'badge-info';
                    case 'split_column':
                        return 'badge-info';
                    case 'enrich':
                        return 'badge-danger';
                    default:
                        return '';
                }
            };
        },
        stepName() {
            return (step) => {
                switch (step.action) {
                    case 'init':
                        return 'Select Dataset';
                    case 'add':
                        return 'Create new column(s)';
                    case 'drop':
                        return 'Drop rows or columns';
                    case 'rename':
                        return 'Rename column(s)';
                    case 'merge':
                        return 'Merge with another dataset';
                    case 'filter_and':
                        return 'Apply conditions (with AND operator)';
                    case 'filter_or':
                        return 'Apply conditions (with OR operator)';
                    case 'aggregate':
                        return 'Compute aggregations';
                    case 'fillna':
                        return 'Fill null values';
                    case 'split_column':
                        return 'Split column';
                    case 'enrich':
                        return 'Enrich content';
                    default:
                        return '';
                }
            };
        },
        initialInputName() {
            if (this.initialized) {
                if (this.initialDataset.type === 'virtualDataset') {
                    return `virtual_dataset_${this.initialDataset.id}`;
                }
                return `dataset_${this.initialDataset.id}`;
            }
            return '';
        },
        availableColumns() {
            if (this.initialDataset) {
                if (this.steps.length > 0) {
                    return this.steps[this.steps.length - 1].columns;
                }

                const columns = R.clone(this.initialDataset.columns);
                R.forEachObjIndexed((value, key) => {
                    columns[key].title = value.title.toLowerCase().replace(/\./g, '__');
                }, columns);

                return columns;
            }

            return [];
        },
    },
    async created() {
        const [
            { data: virtualDataset },
            { data: canDownload },
            { data: previousSteps },
            { data: datasets },
            { data: virtualDatasets },
        ] = await Promise.all([
            VirtualDataset.get(this.id),
            VirtualDataset.canDownload(this.id),
            VirtualDatasetStep.all(this.id),
            DataAsset.bought(),
            VirtualDataset.all(),
        ]);

        this.virtualDataset = virtualDataset;
        this.canDownload = canDownload;
        const sortedPreviousSteps = R.sortBy(R.prop('order'), previousSteps);
        if (
            sortedPreviousSteps[sortedPreviousSteps.length - 1] &&
            !sortedPreviousSteps[sortedPreviousSteps.length - 1].executed
        ) {
            this.activeStep = sortedPreviousSteps.pop();
        }
        this.steps = sortedPreviousSteps;
        await this.checkStepsDatasets(this.steps);
        this.datasets = R.sortBy(
            R.prop('name'),
            R.map((dataset) => {
                const newDataset = R.pick(['id', 'name', 'columns'], dataset);
                newDataset.type = 'dataset';
                return newDataset;
            }, datasets),
        );
        this.virtualDatasets = R.sortBy(
            R.prop('name'),
            R.map(
                (dataset) => {
                    const newDataset = R.pick(
                        ['id', 'name', 'columns', 'completed', 'virtualDatasetSteps', 'input_dataset'],
                        dataset,
                    );
                    newDataset.type = 'virtualDataset';
                    return newDataset;
                },
                R.filter((datasetToFilter) => datasetToFilter.completed, virtualDatasets),
            ),
        );

        if (this.virtualDataset.input_dataset) {
            const id = this.virtualDataset.input_dataset.split('_').pop();
            if (this.virtualDataset.input_dataset.includes('virtual')) {
                const idx = R.findIndex(R.propEq('id', Number(id)))(this.virtualDatasets);
                if (~idx) {
                    this.initialDataset = this.virtualDatasets[idx];
                    this.initialized = true;
                }
            } else {
                const idx = R.findIndex(R.propEq('id', Number(id)))(this.datasets);
                if (~idx) {
                    this.initialDataset = this.datasets[idx];
                    this.initialized = true;
                }
            }
        }

        if (this.initialDataset) {
            await this.showWarning(this.initialDataset.type, this.initialDataset.id, 'initial');
        }

        this.datasetsAreLoaded = true;
    },
    methods: {
        getColumns(selectionRule, parameter) {
            const stepColumns = R.find(R.propEq('order', selectionRule.step_order), this.steps).columns;
            if (this.preparationStepInfoOptions[selectionRule.function]) {
                const filteredColumns = stepColumns.reduce((columns, column) => {
                    if (
                        parameter.facets.filter &&
                        Array.isArray(parameter.facets.filter) &&
                        parameter.facets.filter.length > 0
                    ) {
                        if (parameter.facets.filter.includes(column.type)) {
                            columns.push(column);
                        }
                    } else {
                        columns.push(column);
                    }
                    return columns;
                }, []);
                return R.pluck('title', filteredColumns);
            }
            return [];
        },
        addStep(action) {
            this.activeStep = {
                vd_id: this.id,
                order: this.steps.length + 1,
                action,
                input:
                    this.steps.length === 0 ? this.initialInputName : `virtual_dataset_${this.id}_${this.steps.length}`,
                rules: [{ function: null, parameters: {}, submitted: false }],
                executed: false,
                columns: [],
                error: null,
            };
        },
        async initialize(dataset) {
            this.initialDataset = dataset;
            this.initialized = true;
            const payload = R.clone(this.virtualDataset);
            payload.input_dataset = this.initialInputName;
            const { data } = await VirtualDataset.update(this.id, payload);
            this.virtualDataset = data;
        },
        async deleteStep(step) {
            this.showActiveStepWarning = false;
            if (step.id) {
                await VirtualDatasetStep.delete(step.id);
                this.activeStep = null;
            } else {
                this.activeStep = null;
            }
        },
        async saveStep(step) {
            try {
                this.showActiveStepWarning = false;
                this.stepLoading = true;
                if (step.id === undefined) {
                    const { data: virtualDatasetStep } = await VirtualDatasetStep.create(step);
                    step = virtualDatasetStep;
                } else {
                    const { data: virtualDatasetStep } = await VirtualDatasetStep.update(step.id, step);
                    step = virtualDatasetStep;
                }

                this.activeStep = step;

                const processStepPayload = {
                    id: step.id,
                    organization: this.organization.businessname,
                };

                await this.checkStepsDatasets([step]);

                try {
                    const { data: processedStep } = await VirtualDatasetStep.processStep(processStepPayload);
                    step.columns = processedStep.columns;
                    step.error = processedStep.error;
                    step.applied_rules = processedStep.applied_rules;
                    this.steps.push(step);
                    this.stepLoading = false;
                    this.activeStep = null;
                } catch (error) {
                    this.stepLoading = false;
                    if (error.response && error.response.data && error.response.data.error) {
                        this.activeStep.error = error.response.data.error;
                    } else {
                        this.$toastr.e('Processing service unavailable!', 'Error');
                    }
                }
            } catch (error) {
                this.stepLoading = false;
                this.$toastr.e('Something went wrong!', 'Error');
            }
        },
        async finalize() {
            const lastStep = [...this.steps].pop();
            const payload = {
                vd_id: this.id,
                last_step_order: lastStep.order,
                organization: this.organization.businessname,
            };
            try {
                this.finalizeLoading = true;
                const { data } = await VirtualDatasetStep.processStepFinalize(payload);

                await UsageAnalytics.publish({
                    event_type: 'NEW_VIRTUAL_DATASET',
                    properties: {
                        org_id: this.organization.id,
                        virtual_dataset_id: this.id,
                    },
                    timestamp: Math.floor(Date.now() / 1000),
                }).catch(() => {});

                this.virtualDataset.completed = data.completed;
                this.finalizeLoading = false;
                this.$toastr.s('Virtual dataset finalized!', 'Success');
            } catch (error) {
                this.finalizeLoading = false;
                this.$toastr.e('Virtual dataset could not be finalized!', 'Error');
            }
        },
        visualizeDataset() {
            const dbName = this.organization.businessname
                .replace(/\s/g, '')
                .replace(/[^a-zA-Z0-9]/g, '_')
                .toLowerCase();
            this.$router.push({
                name: 'workspace.visualize',
                params: {
                    dbName,
                    datasetId: this.virtualDataset.id,
                    datasetType: 'virtual_dataset',
                },
            });
        },
        async deleteSavedStep(step) {
            const payload = {
                vd_id: this.id,
                last_step_order: step.order,
                organization: this.organization.businessname,
            };
            await VirtualDatasetStep.deleteStep(payload);
            await VirtualDatasetStep.delete(step.id);
            const { data } = await VirtualDatasetStep.all(this.id);
            console.log(data);
            this.steps = R.sortBy(R.prop('order'), data);
        },
        getValidationErrorMessage(field) {
            const errorObject = R.find(R.propEq('field', field))(this.errors.items);
            switch (errorObject.rule) {
                case 'required':
                    return 'This field is required';
                case 'decimal':
                    return 'This field is required';
                case 'integer':
                    return 'This field should be integer';
                case 'regex':
                    return 'Should start with a lowercase character and contain only lowercase characters, numbers and underscores';
                default:
                    console.log(errorObject);
                    return 'Validation error';
            }
        },
        getStepInfo() {
            this.selectionRule.submitted = true;
            this.$validator.validateAll().then(async (success) => {
                if (success) {
                    this.stepInfoLoading = true;
                    try {
                        const { data } = await VirtualDatasetStep.getStepInfo(this.selectionRule);
                        this.stepInfoResult = data;
                        this.stepInfoLoading = false;
                    } catch {
                        this.stepInfoLoading = false;
                        this.$toastr.e('Something went wrong while trying to fetch step information', 'Error');
                    }
                } else {
                    this.stepInfoLoading = false;
                }
            });
        },
        showStepInfoModal(step) {
            this.stepInfoResult = null;
            this.stepInfoLoading = false;
            this.selectionRule.vd_id = step.vd_id;
            this.selectionRule.step_order = step.order;
            this.selectionRule.organization = this.organization.businessname;
            this.selectionRule.function = null;
            this.selectionRule.parameters = {};
            this.$bvModal.show('getStepInfo');
        },
        clearSelectionRule() {
            this.selectionRule.submitted = false;
            this.selectionRule.parameters = {};
        },
        closeGetStepInfoModal() {
            this.selectionRule = {
                submitted: false,
                function: null,
                parameters: {},
            };
        },
        async showDatasetWarning(id) {
            const { data } = await DataAsset.get(id);
            if (data && data.metadata && data.metadata.derivation && !data.metadata.derivation.includes('Modify')) {
                return true;
            }
            return false;
        },
        async showVirtualDatasetWarning(id) {
            const virtualDataset = this.virtualDatasets.find((vd) => vd.id.toString() === id.toString());
            // check virtual dataset's input dataset
            if (virtualDataset && virtualDataset.input_dataset) {
                const inputDatasetSplit = virtualDataset.input_dataset.split('_');
                if (virtualDataset.input_dataset.includes('virtual_dataset')) {
                    const showWarning = await this.showVirtualDatasetWarning(inputDatasetSplit[2]);
                    if (showWarning) {
                        return true;
                    }
                } else if (virtualDataset.input_dataset.includes('dataset')) {
                    const showWarning = await this.showDatasetWarning(inputDatasetSplit[1]);
                    if (showWarning) {
                        return true;
                    }
                }
            }
            // check virtual dataset's merged datasets
            if (virtualDataset && virtualDataset.virtualDatasetSteps) {
                virtualDataset.virtualDatasetSteps.forEach((step) => {
                    if (step.action === 'merge') {
                        return step.rules.forEach(async (rule) => {
                            if (rule.parameters.dataset_b) {
                                const inputDatasetSplit = rule.parameters.dataset_b.split('_');
                                if (rule.parameters.dataset_b.includes('virtual_dataset')) {
                                    const showWarning = await this.showVirtualDatasetWarning(inputDatasetSplit[2]);
                                    if (showWarning) {
                                        return true;
                                    }
                                } else if (rule.parameters.dataset_b.includes('dataset')) {
                                    const showWarning = await this.showDatasetWarning(inputDatasetSplit[1]);
                                    if (showWarning) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        });
                    }
                    return false;
                });
            }
            return false;
        },
        checkDataset(type, id) {
            if (type === 'dataset') {
                return this.showDatasetWarning(id);
            }
            if (type === 'virtualDataset') {
                return this.showVirtualDatasetWarning(id);
            }
            return false;
        },
        async showWarning(type, id, warningType) {
            const showWarning = await this.checkDataset(type, id);
            if (showWarning) {
                switch (warningType) {
                    case 'initial':
                        this.showInitialWarning = true;
                        break;
                    case 'activeStep':
                        this.showActiveStepWarning = true;
                        break;
                    default: //
                }
            } else {
                switch (warningType) {
                    case 'initial':
                        this.showInitialWarning = false;
                        break;
                    case 'activeStep':
                        this.showActiveStepWarning = false;
                        break;
                    default: //
                }
            }
        },
        async checkStepsDatasets(steps) {
            steps.forEach((step) => {
                this.stepsWarnings[step.id] = false;
                step.rules.forEach(async (rule) => {
                    if (rule.parameters.dataset_b) {
                        const datasetSplit = rule.parameters.dataset_b.split('_');
                        if (rule.parameters.dataset_b.includes('virtual_dataset')) {
                            const showWarning = await this.checkDataset('virtualDataset', datasetSplit[2]);
                            if (showWarning) {
                                this.stepsWarnings[step.id] = true;
                            }
                        }
                        if (rule.parameters.dataset_b.includes('dataset')) {
                            const showWarning = await this.checkDataset('dataset', datasetSplit[1]);
                            if (showWarning) {
                                this.stepsWarnings[step.id] = true;
                            }
                        }
                    }
                });
            });
        },
        async downloadVirtualDataset(id) {
            try {
                await VirtualDataset.download(id);
                this.downloading = true;
                this.$toastr.s(
                    'Results are being prepared. Once they are ready, you will get a notification with a link to download them.',
                    'Success',
                );
            } catch {
                this.$toastr.e('Something went wrong while trying to download virtual dataset!', 'Error');
            }
        },
    },
};
</script>

<style lang="scss">
.dataset-editor {
    .alert-light {
        background-color: #ebebeb;
        border-color: #e0e0e0;
    }

    .step-info-button {
        color: var(--primary);
        font-size: 0.75rem;
        text-decoration: underline;
        cursor: pointer;
    }
}

.info-modal-content {
    max-height: 600px;
    overflow-y: auto;
}
</style>
