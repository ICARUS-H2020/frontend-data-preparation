<template>
    <div class="dashboard">
        <div class="row">
            <div class="col-12">
                <b-alert
                    variant="danger"
                    :show="$store.state.eth.wallet === null && organization && organization.id !== 1 && !isLoading"
                >
                    <font-awesome-icon icon="exclamation-triangle" class="mr-1" />
                    Your organization has no linked Ethereum wallet.
                    <template v-if="isOrgAdmin">
                        You can
                        <a href="javascript:void(0)" @click="showImportWalletModal">import</a>
                        an existing wallet, or
                        <a href="javascript:void(0)" @click="showCreateWalletModal">create</a>
                        a new one.
                    </template>
                    <template v-else>
                        Ask your organization manager to login and create or import an existing one.
                    </template>
                </b-alert>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <div class="mb-3 card card-border">
                    <div class="card-body assets-activity">
                        <h5 class="card-title">
                            Assets' Activity
                            <tooltip
                                v-b-tooltip="
                                    'A list of updates regarding the assets that the user’s organization owns or has acquired.'
                                "
                            />
                        </h5>
                        <vue-perfect-scrollbar style="height: 730px;">
                            <div class="loading-indicator" v-if="assetsActivityLoading">
                                <Spinner name="wave" color="var(--primary)" no-fade-in />
                                <h6 class="message">Loading asset's activity... Please wait...</h6>
                            </div>
                            <div
                                class="vertical-timeline vertical-timeline--animate vertical-timeline--one-column"
                                v-else-if="assetsActivity.length > 0"
                            >
                                <div class="vertical-timeline-element" v-for="asset in assetsActivity" :key="asset.id">
                                    <div>
                                        <span class="vertical-timeline-element-icon bounce-in">
                                            <i
                                                class="badge badge-dot badge-dot-xl badge-info"
                                                v-if="asset.activity === 'created'"
                                            />
                                            <i class="badge badge-dot badge-dot-xl badge-warning" v-else />
                                        </span>
                                        <div class="vertical-timeline-element-content bounce-in">
                                            <h4 class="timeline-title">Asset {{ asset.activity }}</h4>
                                            <p>{{ asset.name }}</p>
                                            <span class="vertical-timeline-element-date">
                                                <time-ago :datetime="asset.date" :long="true"></time-ago>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="alert alert-info" role="alert" v-else>
                                <font-awesome-icon icon="info-circle" />
                                <span class="ml-2">There is no recent activity in your assets to display!</span>
                            </div>
                        </vue-perfect-scrollbar>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="row">
                    <div class="col-12">
                        <div class="mb-3 card card-border">
                            <div class="card-body">
                                <h5 class="card-title">
                                    Pending Tasks
                                    <tooltip
                                        v-b-tooltip="'A list of the tasks that require the user’s immediate attention.'"
                                    />
                                </h5>
                                <vue-perfect-scrollbar :style="style">
                                    <div
                                        class="loading-indicator"
                                        v-if="
                                            assetsPendingTasksLoading ||
                                            buyassetsPendingTasksLoading ||
                                            contractsPendingTasksLoading
                                        "
                                    >
                                        <Spinner name="wave" color="var(--primary)" no-fade-in />
                                        <h6 class="message">Loading pending tasks... Please wait...</h6>
                                    </div>
                                    <ul
                                        class="todo-list-wrapper list-group list-group-flush"
                                        v-else-if="pendingTasks.length > 0"
                                    >
                                        <li
                                            class="list-group-item pending-task-item"
                                            v-for="task in pendingTasks"
                                            :key="task.key"
                                            @click="$router.push(task.route)"
                                        >
                                            <!-- <div class="todo-indicator bg-warning pending-task-indicator"></div> -->
                                            <div class="widget-content p-0">
                                                <div class="widget-content-wrapper">
                                                    <div class="widget-content-left mr-3">
                                                        <div class="widget-content-left icon-container">
                                                            <font-awesome-icon
                                                                :icon="task.icon"
                                                                class="icon"
                                                                size="2x"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="widget-content-left">
                                                        <div class="widget-heading">{{ task.label }}</div>
                                                        <div class="widget-subheading">
                                                            <i>{{ task.subheading }}</i>
                                                        </div>
                                                    </div>
                                                    <div class="widget-content-right">
                                                        <div class="widget-subheading">
                                                            <time-ago :datetime="task.date" :long="true"></time-ago>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="alert alert-info" role="alert" v-else>
                                        <font-awesome-icon icon="info-circle" />
                                        <span class="ml-2">No tasks requiring your attention!</span>
                                    </div>
                                </vue-perfect-scrollbar>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="organization.id !== 1">
                    <div class="col-12">
                        <div class="mb-3 card card-border">
                            <div class="card-body">
                                <h5 class="card-title">
                                    Recommended Datasets
                                    <tooltip v-b-tooltip="'A list of the top recommended datasets.'" />
                                </h5>
                                <vue-perfect-scrollbar style="height: 322px;">
                                    <div class="loading-indicator" v-if="recommendedDatasetsLoading">
                                        <Spinner name="wave" color="var(--primary)" no-fade-in />
                                        <h6 class="message">Loading recommended datasets... Please wait...</h6>
                                    </div>
                                    <div class="row my-0" v-else-if="recommendedDatasets.length > 0">
                                        <div
                                            class="card-item-overview col-sm-6"
                                            v-for="(dataset, index) in recommendedDatasets"
                                            :key="index"
                                        >
                                            <div
                                                class="wrapper"
                                                :style="{ 'background-image': getImageUrl(dataset.dataset_id) }"
                                                :class="{
                                                    'default-bg-image': getImageUrl(dataset.dataset_id) === 'inherit',
                                                }"
                                                @click="goToTargetRoute(dataset.dataset_id)"
                                            >
                                                <div class="overlay"></div>
                                                <div class="col-sm-12 content">
                                                    <div class="title-wrapper">
                                                        <div class="title">
                                                            <h1>{{ dataset.dataset_name }}</h1>
                                                            <h3>{{ dataset.org_name }}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="alert alert-info" role="alert" v-else>
                                        <font-awesome-icon icon="info-circle" />
                                        <span class="ml-2">There are no recommended datasets to display!</span>
                                    </div>
                                </vue-perfect-scrollbar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <create-wallet-modal />
        <import-wallet-modal />
    </div>
</template>

<script>
import TimeAgo from 'vue2-timeago';
import { mapGetters, mapState } from 'vuex';
import { descend, sortBy, prop, filter, forEach } from 'ramda';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faExclamationTriangle,
    faFile,
    faCoins,
    faReply,
    faComments,
    faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Contract, DataAsset, Recommendation } from '@/api';
import { Tooltip } from '@/components';
import CreateWalletModal from '@/layouts/architect/components/modals/CreateWalletModal.vue';
import ImportWalletModal from '@/layouts/architect/components/modals/ImportWalletModal.vue';

const baseURL = process.env.VUE_APP_API_URL;
const R = { descend, sortBy, prop, filter, forEach };
library.add(faExclamationTriangle, faFile, faCoins, faReply, faComments, faCommentDots);

export default {
    name: 'Dashboard',
    components: { FontAwesomeIcon, TimeAgo, VuePerfectScrollbar, Tooltip, CreateWalletModal, ImportWalletModal },
    filters: {
        capitalize(s) {
            if (typeof s !== 'string') return '';
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
    },
    data() {
        return {
            contractRequests: [],
            assetsActivity: [],
            notifications: [],
            pendingTasks: [],
            recommendedDatasets: [],
            imagesUrls: [],
            assetsActivityLoading: true,
            assetsPendingTasksLoading: true,
            buyassetsPendingTasksLoading: true,
            contractsPendingTasksLoading: true,
            recommendedDatasetsLoading: true,
            assets: [],
        };
    },
    computed: {
        ...mapState(['organization']),
        ...mapGetters(['isOrgAdmin']),
        assetActivity() {
            return R.sortBy(R.descend(R.prop('created')), this.assets);
        },
        style() {
            if (this.organization.id !== 1) {
                return 'height: 322px;';
            }
            return 'height: 730px;';
        },
        isLoading() {
            return (
                this.assetsActivityLoading &&
                this.assetsPendingTasksLoading &&
                this.buyassetsPendingTasksLoading &&
                this.contractsPendingTasksLoading &&
                this.recommendedDatasetsLoading
            );
        },
    },
    async created() {
        let contracts = [];
        let assets = [];
        let buyassets = [];

        if (this.organization && this.organization.id !== 1) {
            const payload = { org_id: this.organization.id, datasets_id: [] };
            Recommendation.recommender(payload).then((response) => {
                const datasets = response.data;
                this.recommendedDatasets = datasets.recommended_datasets.slice(0, 4);
                R.forEach(async (recommendedDataset) => {
                    const { data: dataset } = await DataAsset.get(recommendedDataset.dataset_id);
                    const imageId = dataset.coverphoto;
                    const { data: image } = await DataAsset.getImage(imageId);
                    if (image.length > 0) {
                        this.imagesUrls.push({
                            id: recommendedDataset.dataset_id,
                            url: `url(${baseURL}/data-asset/coverphoto-image/${imageId})`,
                        });
                    } else {
                        this.imagesUrls.push({ id: recommendedDataset.dataset_id, url: 'inherit' });
                    }
                }, this.recommendedDatasets);
                this.recommendedDatasetsLoading = false;
            });
        }

        DataAsset.organizationAll(this.organization.id).then((response) => {
            assets = response.data;
            R.forEach((asset) => {
                if (asset.created) {
                    this.assetsActivity.push({
                        id: `${asset.id}_created`,
                        name: asset.name,
                        date: asset.created,
                        activity: 'created',
                    });
                }
                if (asset.updated) {
                    this.assetsActivity.push({
                        id: `${asset.id}_updated`,
                        name: asset.name,
                        date: asset.updated,
                        activity: 'updated',
                    });
                }
            }, assets);
            this.assetsActivity.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            this.assetsActivityLoading = false;
            R.forEach((asset) => {
                if (asset.jobState === 'UNCOMPLETED') {
                    this.pendingTasks.push({
                        ...asset,
                        ...{
                            label: 'Missing metadata',
                            subheading: `Dataset: ${asset.name}`,
                            key: `${asset.id}_dataset`,
                            date: asset.created,
                            icon: 'file',
                            route: { name: 'assets.dataset.edit', params: { id: asset.id } },
                        },
                    });
                }
            }, assets);
            this.pendingTasks.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            this.assetsPendingTasksLoading = false;
        });

        Contract.requests().then((res) => {
            buyassets = res.data;
            R.forEach((buyasset) => {
                let assetName = '';
                const assetType = this.getAssetType(buyasset);
                if (assetType === 'dataset') {
                    assetName = buyasset.data_asset.name;
                } else if (assetType === 'application') {
                    assetName = buyasset.application.name;
                }
                if (buyasset.request === null && buyasset.organization_owner.id === this.organization.id) {
                    this.pendingTasks.push({
                        ...buyasset,
                        ...{
                            label: `Contract requested by ${buyasset.organization_consumer.name}`,
                            subheading: `${this.$options.filters.capitalize(assetType)}: ${assetName}`,
                            key: `${buyasset.id}_buyasset`,
                            date: buyasset.created,
                            icon: 'comments',
                            route: {
                                name: 'marketplace.contract',
                                params: { requestId: buyasset.id, assetType },
                            },
                        },
                    });
                } else if (buyasset.request === null && buyasset.organization_consumer.id === this.organization.id) {
                    this.notifications.push({
                        id: buyasset.id,
                        label: `You have requested contract for the ${assetType} ${assetName}`,
                        date: buyasset.created,
                    });
                } else if (buyasset.request === true && buyasset.organization_consumer.id === this.organization.id) {
                    this.notifications.push({
                        id: buyasset.id,
                        label: `Your contract request for the ${assetType} ${assetName} has been accepted`,
                        date: buyasset.created,
                    });
                } else if (buyasset.request === false && buyasset.organization_consumer.id === this.organization.id) {
                    this.notifications.push({
                        id: buyasset.id,
                        label: `Your contract request for the ${assetType} ${assetName} has been declined`,
                        date: buyasset.created,
                    });
                }
            }, buyassets);
            this.notifications.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            this.pendingTasks.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            this.buyassetsPendingTasksLoading = false;
        });

        if (this.organization && this.organization.id !== 1) {
            Contract.all().then((re) => {
                contracts = re.data;
                R.forEach((contract) => {
                    let assetName = '';
                    const assetType = this.getAssetType(contract);
                    if (assetType === 'dataset') {
                        assetName = contract.data_asset.name;
                    } else if (assetType === 'application') {
                        assetName = contract.application.name;
                    }
                    if (contract.stage === 'Draft' && contract.organization_consumer.id === this.organization.id) {
                        this.pendingTasks.push({
                            ...contract,
                            ...{
                                label: `Contract response received by ${contract.organization_owner.name}`,
                                subheading: `${this.$options.filters.capitalize(assetType)}: ${assetName}`,
                                key: `${contract.id}_contract`,
                                date: contract.updated,
                                icon: 'reply',
                                route: {
                                    name: 'marketplace.contract',
                                    params: { contractId: contract.id, assetType },
                                },
                            },
                        });
                    }
                    if (contract.stage === 'Accepted') {
                        this.pendingTasks.push({
                            ...contract,
                            ...{
                                label: `Pending Payment by ${contract.organization_consumer.name}`,
                                subheading: `${this.$options.filters.capitalize(assetType)}: ${assetName}`,
                                key: `${contract.id}_contract`,
                                date: contract.updated,
                                icon: 'coins',
                                route: {
                                    name: 'marketplace.contract',
                                    params: { contractId: contract.id, assetType },
                                },
                            },
                        });
                    }
                    if (contract.stage === 'Negotiating') {
                        this.pendingTasks.push({
                            ...contract,
                            ...{
                                label: `Pending contract response by ${contract.organization_owner.name}`,
                                subheading: `${this.$options.filters.capitalize(assetType)}: ${assetName}`,
                                key: `${contract.id}_contract`,
                                date: contract.updated,
                                icon: 'comment-dots',
                                route: {
                                    name: 'marketplace.contract',
                                    params: { contractId: contract.id, assetType },
                                },
                            },
                        });
                    }
                }, contracts);
                this.pendingTasks.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });
                this.contractsPendingTasksLoading = false;
            });
        } else {
            this.contractsPendingTasksLoading = false;
        }
    },
    methods: {
        showCreateWalletModal() {
            this.$bvModal.show('createWallet');
        },
        showImportWalletModal() {
            this.$bvModal.show('importWallet');
        },
        goToTargetRoute(datasetId) {
            this.$router.push({ name: 'assets.dataset', params: { id: datasetId } });
        },
        getImageUrl(id) {
            const index = this.imagesUrls.findIndex((x) => x.id === id);
            if (this.imagesUrls[index]) {
                return this.imagesUrls[index].url;
            }
            return '';
        },
        getAssetType(contract) {
            if (contract.data_asset) {
                return 'dataset';
            }
            if (contract.application) {
                return 'application';
            }
            return '';
        },
    },
};
</script>

<style lang="scss">
.dashboard {
    .assets-activity {
        .vertical-timeline::before {
            left: 112px;
        }
        .vertical-timeline-element-content {
            margin-left: 135px;
        }
        .vertical-timeline-element-icon {
            left: 105px;
        }
        .vertical-timeline-element-content .vertical-timeline-element-date {
            left: -135px;
        }
    }

    .pending-task-item {
        padding-left: 0;
        padding-right: 0;
        cursor: pointer;

        .icon-container {
            display: flex;
            width: 42px;
            height: 42px;

            .icon {
                margin: auto;
                color: var(--primary);
            }
        }
    }

    .notifications {
        .vertical-timeline {
            padding: 1.5rem 1rem 1rem 0;
        }
        .vertical-timeline::before {
            left: 30px;
        }
        .vertical-timeline-element-content {
            margin-left: 53px;
        }
        .vertical-timeline-element-icon {
            left: 23px;
        }
        .vertical-timeline-element-content .vertical-timeline-element-date {
            left: -53pxpx;
        }
    }

    .v-time-ago__text {
        cursor: inherit;
    }

    // .datasets {
    //     display: grid;
    //     grid-template-columns: repeat(2, 1fr);
    // }

    .card-item-overview {
        margin-top: 1rem;
        margin-bottom: 1rem;

        .overlay {
            position: absolute;
            top: 0;
            left: 15px;
            right: 15px;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 0.3rem;
        }

        .default-bg-image {
            background-image: url('../../assets/images/banner.png') !important;
        }

        .wrapper {
            height: 8rem;
            background-size: cover;
            background-position: center center;
            display: flex;
            border-radius: 0.3rem;
            cursor: pointer;

            .content {
                padding: 0.5rem 1rem;
                color: white;

                .title-wrapper {
                    height: 8rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    h1 {
                        font-weight: 600;
                        font-size: 1.25rem;
                    }

                    h3 {
                        font-size: 0.9rem;
                    }
                }
            }
        }
    }
}
</style>
